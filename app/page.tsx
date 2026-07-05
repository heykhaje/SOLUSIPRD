'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
}

export default function Home() {
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [prdResult, setPrdResult] = useState<string | null>(null);
  const [flowchartResult, setFlowchartResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopiedPrd, setIsCopiedPrd] = useState(false);
  const router = useRouter();

  const loadingMessages = [
    "Menghubungkan...",
    "Menganalisa ide brilian Anda...",
    "Menyusun struktur dokumen PRD...",
    "Merancang User Flow...",
    "Melakukan sentuhan akhir...",
    "Sedikit lagi selesai..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  // Revision chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved data from localStorage on mount
    const savedPrd = localStorage.getItem('solusiprd_prd');
    const savedFlowchart = localStorage.getItem('solusiprd_flowchart');
    const savedPrompt = localStorage.getItem('solusiprd_prompt');
    if (savedPrd) {
      setPrdResult(savedPrd);
      setFlowchartResult(savedFlowchart);
      if (savedPrompt) setUserPrompt(savedPrompt);
      setChatMessages([
        { role: 'ai', content: 'PRD berhasil dimuat kembali! 🎉 Ada bagian yang ingin Anda revisi?' },
      ]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleCopyPrd = async () => {
    if (prdResult) {
      await navigator.clipboard.writeText(prdResult);
      setIsCopiedPrd(true);
      setTimeout(() => setIsCopiedPrd(false), 2000);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Paywall check
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    let isSubscribed = false;
    let subscriptionTier = 'free';

    if (userData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userData.user.id)
        .single();
      
      const adminEmail = 'adjiprasetyo970@gmail.com'; // Admin always bypasses paywall
      const allowedTiers = ['basic', 'pro', 'max'];
      
      if (userData.user.email === adminEmail) {
        isSubscribed = true;
        subscriptionTier = 'max'; // Admin gets max tier by default
      } else if (profile?.subscription_status && allowedTiers.includes(profile.subscription_status)) {
        isSubscribed = true;
        subscriptionTier = profile.subscription_status;
      }
      
      if (!isSubscribed) {
        router.push('/pricing');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, tier: subscriptionTier }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate PRD');
      }

      setPrdResult(data.prd);
      setFlowchartResult(data.flowchart || null);

      // Store all data in localStorage for persistence
      localStorage.setItem('solusiprd_prd', data.prd);
      localStorage.setItem('solusiprd_prompt', userPrompt);
      if (data.flowchart) {
        localStorage.setItem('solusiprd_flowchart', data.flowchart);
      }

      // Initialize chat with welcome message
      setChatMessages([
        {
          role: 'ai',
          content: 'PRD berhasil di-generate! 🎉 Ada bagian yang ingin Anda revisi? Ketik permintaan Anda di bawah.',
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevise = async () => {
    if (!chatInput.trim() || !prdResult || isRevising) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsRevising(true);

    try {
      const res = await fetch('/api/revise-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPrd: prdResult, userMessage: userMsg }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal merevisi PRD');
      }

      setPrdResult(data.prd);
      localStorage.setItem('solusiprd_prd', data.prd);
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'PRD telah diperbarui sesuai permintaan Anda. ✅ Silakan periksa panel kiri.' },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', content: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setIsRevising(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleRevise();
    }
  };
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen relative flex flex-col font-body bg-[#060918] text-[#f8fafc]">
      <DitherBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-[#0a0f25]/40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex-shrink-0 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-0">
              <div className="flex items-center justify-center -mt-1 -mr-2">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-[#f8fafc] block leading-none">
                  SOLUSIPRD
                </span>
                <span className="font-body text-[10px] text-white/60 tracking-wider uppercase">
                  PRD Generator
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {prdResult && flowchartResult && (
                <a
                  href="/flowchart"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-[10px] uppercase tracking-wider transition-colors shadow-md"
                >
                  User Flow
                </a>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e293b]/40 backdrop-blur-md border border-white/10 shadow-sm font-heading font-bold text-[10px] uppercase tracking-wider text-[#f8fafc]">
                AI-Powered
              </span>
              <button
                onClick={handleSignOut}
                className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-heading font-bold text-[10px] uppercase tracking-wider transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 min-h-[calc(100vh-80px)]">
          {!prdResult ? (
            /* Ideation Form State */
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-[#f8fafc] leading-tight tracking-tight mb-3">
                  What do you want to build?
                </h1>
                <p className="font-body text-white/70 text-base lg:text-lg">
                  Describe your app idea below. Be as detailed or as brief as you like.
                </p>
              </div>

              <div className="w-full bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl p-6 lg:p-8">
                <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="prompt" className="font-heading font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
                      Your Idea
                    </label>
                    <textarea
                      id="prompt"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      placeholder="Contoh: Saya ingin membuat aplikasi booking studio musik lengkap dengan sistem pembayaran..."
                      rows={5}
                      className="w-full bg-[#060918]/60 backdrop-blur-md border border-white/10 focus:border-indigo-400 rounded-xl p-4 font-body text-base text-[#f8fafc] placeholder:text-white/40 shadow-inner focus:outline-none transition-colors resize-none"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-700 font-body text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !userPrompt.trim()}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-base rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="animate-pulse">{loadingMessages[loadingMessageIndex]}</span>
                      </>
                    ) : (
                      'Generate PRD'
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Split Screen Result State */
            <div className="w-full max-w-[1800px] h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300 flex-1 min-h-0">
              {/* Left Panel: PRD Document */}
              <div className="lg:w-3/5 w-full h-full min-h-[500px] bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-base font-extrabold text-[#f8fafc]">PRD Document</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCopyPrd}
                      className="text-xs font-heading font-bold text-[#f8fafc] hover:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      {isCopiedPrd ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={() => {
                        setPrdResult(null);
                        setFlowchartResult(null);
                        setUserPrompt('');
                        setChatMessages([]);
                        localStorage.removeItem('solusiprd_prd');
                        localStorage.removeItem('solusiprd_flowchart');
                        localStorage.removeItem('solusiprd_prompt');
                      }}
                      className="text-xs font-heading font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wider"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <article className="prose prose-slate prose-invert max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-p:font-body prose-li:font-body prose-a:text-indigo-400">
                    <ReactMarkdown>{prdResult}</ReactMarkdown>
                  </article>
                </div>
              </div>

              {/* Right Panel: Revision Chat */}
              <div className="lg:w-2/5 w-full h-full min-h-[500px] bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading text-base font-extrabold text-[#f8fafc]">Revision Chat</h2>
                  </div>
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isRevising ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="font-body text-[10px] text-white/70">
                      {isRevising ? 'Revising...' : 'AI Ready'}
                    </span>
                  </span>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 custom-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-sm shadow-md'
                            : 'bg-[#1e293b]/80 backdrop-blur-md border border-white/10 text-[#f8fafc] rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isRevising && (
                    <div className="flex justify-start">
                      <div className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick Action Chips */}
                <div className="px-5 pb-2 flex flex-wrap gap-2">
                  {['Tambah fitur baru', 'Perbaiki user flow', 'Tambah section timeline'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => {
                        setChatInput(chip);
                      }}
                      disabled={isRevising}
                      className="text-[11px] font-heading font-bold text-indigo-300 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-400/30 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex-shrink-0">
                  <div className="flex gap-2">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleChatKeyDown}
                      placeholder="Ketik permintaan revisi... (Enter untuk kirim)"
                      rows={1}
                      className="flex-1 bg-[#0a0f25]/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-[#f8fafc] placeholder:text-white/40 focus:outline-none focus:border-indigo-400 resize-none shadow-inner"
                      disabled={isRevising}
                    />
                    <button
                      onClick={handleRevise}
                      disabled={isRevising || !chatInput.trim()}
                      className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors flex items-center justify-center disabled:opacity-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] font-body text-center text-white/50 mt-2">
                    Tekan Enter untuk mengirim · Shift+Enter untuk baris baru
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="w-full py-6 text-center relative z-10 flex-shrink-0">
          <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
            &copy; 2026 by Adji.DEV
          </p>
        </footer>
      </div>
    </div>
  );
}
