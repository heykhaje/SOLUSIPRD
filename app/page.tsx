'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import StructureDiagram from '@/components/StructureDiagram';
import TaskDiagram from '@/components/TaskDiagram';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
}

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Ide, 2: Struktur, 3: PRD, 4: Task
  
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  const [structureResult, setStructureResult] = useState<any>(null);
  const [prdResult, setPrdResult] = useState<string | null>(null);
  const [flowchartResult, setFlowchartResult] = useState<string | null>(null); // Now stores Tasks
  const [error, setError] = useState<string | null>(null);
  const [isCopiedPrd, setIsCopiedPrd] = useState(false);
  const [isCopiedTasks, setIsCopiedTasks] = useState(false);
  
  const router = useRouter();

  const loadingMessages = [
    "Menghubungkan ke server AI...",
    "Menganalisa ide brilian Anda...",
    "Menyusun struktur...",
    "Merancang sistem...",
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
    const savedPrd = localStorage.getItem('solusiprd_prd');
    const savedFlowchart = localStorage.getItem('solusiprd_flowchart');
    const savedPrompt = localStorage.getItem('solusiprd_prompt');
    const savedStructure = localStorage.getItem('solusiprd_structure');
    
    if (savedPrd && savedStructure) {
      setStructureResult(JSON.parse(savedStructure));
      setPrdResult(savedPrd);
      setFlowchartResult(savedFlowchart);
      if (savedPrompt) setUserPrompt(savedPrompt);
      setStep(3); // Default to PRD if returning
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

  const handleCopyTasks = async () => {
    if (flowchartResult) {
      await navigator.clipboard.writeText(flowchartResult);
      setIsCopiedTasks(true);
      setTimeout(() => setIsCopiedTasks(false), 2000);
    }
  };

  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/generate-structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate structure');

      setStructureResult(data.structure);
      localStorage.setItem('solusiprd_structure', JSON.stringify(data.structure));
      localStorage.setItem('solusiprd_prompt', userPrompt);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrd = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    let subscriptionTier = 'free';

    if (userData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', userData.user.id)
        .maybeSingle();
      
      const adminEmail = 'adjiprasetyo970@gmail.com';
      const allowedTiers = ['basic', 'pro', 'max'];
      
      if (userData.user.email === adminEmail) {
        subscriptionTier = 'max';
      } else if (profile?.subscription_status && allowedTiers.includes(profile.subscription_status)) {
        subscriptionTier = profile.subscription_status;
      } else {
        router.push('/pricing');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    // Pass the structural context along with the prompt to ensure PRD follows the mind map
    const combinedPrompt = `MIND MAP TERKINI:\n${JSON.stringify(structureResult, null, 2)}\n\nIDE AWAL: ${userPrompt}`;

    try {
      const res = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: combinedPrompt, tier: subscriptionTier }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to generate PRD');
      }

      setPrdResult(data.prd);
      setFlowchartResult(data.flowchart || null);

      localStorage.setItem('solusiprd_prd', data.prd);
      if (data.flowchart) {
        localStorage.setItem('solusiprd_flowchart', data.flowchart);
      }

      setChatMessages([
        {
          role: 'ai',
          content: 'PRD berhasil di-generate! 🎉 Ada bagian yang ingin Anda revisi? Ketik permintaan Anda di bawah.',
        },
      ]);
      setStep(3);
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
      if (!res.ok) throw new Error(data.error || 'Gagal merevisi PRD');

      setPrdResult(data.prd);
      localStorage.setItem('solusiprd_prd', data.prd);
      
      if (data.flowchart) {
        setFlowchartResult(data.flowchart);
        localStorage.setItem('solusiprd_flowchart', data.flowchart);
      }

      setChatMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'PRD telah diperbarui sesuai permintaan Anda. ✅ Silakan periksa dokumen.' },
      ]);
    } catch (err: any) {
      setChatMessages((prev) => [...prev, { role: 'ai', content: `⚠️ Error: ${err.message}` }]);
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

  const resetAll = () => {
    setPrdResult(null);
    setFlowchartResult(null);
    setStructureResult(null);
    setUserPrompt('');
    setChatMessages([]);
    setStep(1);
    localStorage.removeItem('solusiprd_prd');
    localStorage.removeItem('solusiprd_flowchart');
    localStorage.removeItem('solusiprd_prompt');
    localStorage.removeItem('solusiprd_structure');
  };

  return (
    <div className="min-h-screen relative flex flex-col font-body bg-[#060918] text-[#f8fafc]">
      <DitherBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-[#0a0f25]/40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex-shrink-0 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-0">
              <div className="flex items-center justify-center -mt-1 mr-1">
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
            
            {/* Minimalist Stepper UI for Step > 1 */}
            {step > 1 && (
              <div className="hidden md:flex items-center gap-4 px-6 py-2 bg-[#1e293b]/50 border border-white/10 rounded-full">
                <button 
                  onClick={() => setStep(2)} 
                  className={`flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-widest transition-colors ${step === 2 ? 'text-indigo-400' : 'text-white/40 hover:text-white/70'}`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40'}`}>1</span>
                  Struktur
                </button>
                <div className="w-8 h-[1px] bg-white/10" />
                <button 
                  onClick={() => prdResult && setStep(3)} 
                  disabled={!prdResult}
                  className={`flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-widest transition-colors ${step === 3 ? 'text-indigo-400' : 'text-white/40 hover:text-white/70'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40'}`}>2</span>
                  PRD
                </button>
                <div className="w-8 h-[1px] bg-white/10" />
                <button 
                  onClick={() => flowchartResult && setStep(4)}
                  disabled={!flowchartResult} 
                  className={`flex items-center gap-2 text-[11px] font-heading font-bold uppercase tracking-widest transition-colors ${step === 4 ? 'text-indigo-400' : 'text-white/40 hover:text-white/70'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 4 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-white/40'}`}>3</span>
                  Task
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
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
        <main className={`flex-1 flex flex-col min-h-[calc(100vh-80px)] ${(step === 2 || step === 4) ? 'p-0' : 'p-6 lg:p-10'}`}>
          {step === 1 && (
            /* Ideation Form State */
            <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col justify-center animate-in fade-in duration-300">
              <div className="text-center mb-8">
                <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-[#f8fafc] leading-tight tracking-tight mb-3">
                  What do you want to build?
                </h1>
                <p className="font-body text-white/70 text-base lg:text-lg">
                  Describe your app idea below. Be as detailed or as brief as you like.
                </p>
              </div>

              <div className="w-full bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl p-6 lg:p-8">
                <form onSubmit={handleGenerateStructure} className="flex flex-col gap-6">
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
                      'Generate Structure'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 2 && structureResult && (
            <div className="w-full h-full flex flex-col flex-1 animate-in fade-in duration-300">
              <div className="flex-1 bg-[#0a0f25]/50 backdrop-blur-xl overflow-hidden flex flex-col relative min-h-[calc(100vh-80px)] border-t border-white/10">
                <div className="absolute inset-0">
                  <StructureDiagram data={structureResult} />
                </div>
                
                {/* Overlay Lanjutkan Button */}
                <div className="fixed bottom-8 right-8 z-[60] flex gap-3 shadow-2xl">
                  {error && (
                    <div className="px-4 py-2 bg-rose-500/90 text-white rounded-xl font-body text-sm shadow-lg flex items-center justify-center mr-2">
                      {error}
                    </div>
                  )}
                   <button
                    onClick={resetAll}
                    className="px-5 py-2.5 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-500/20 text-rose-300 rounded-xl font-heading font-bold text-sm shadow-lg transition-colors"
                  >
                    Ulangi
                  </button>
                  <button
                    onClick={handleGeneratePrd}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-heading font-bold text-sm shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-colors flex items-center gap-2"
                  >
                    {isLoading ? 'Sedang Memproses...' : 'Lanjutkan ke PRD >'}
                  </button>
                </div>

                {isLoading && (
                  <div className="absolute inset-0 bg-[#060918]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                    <span className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                    <span className="font-heading font-bold text-white tracking-widest uppercase">{loadingMessages[loadingMessageIndex]}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && prdResult && (
            <div className="w-full h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300 flex-1 min-h-[600px]">
              {/* PRD Document */}
              <div className="lg:w-3/5 w-full h-full bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                  <h2 className="font-heading text-base font-extrabold text-[#f8fafc]">PRD Document</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => downloadMarkdown(prdResult, `PRD-${new Date().getTime()}.md`)}
                      className="text-xs font-heading font-bold text-[#f8fafc] hover:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Download .md
                    </button>
                    <button
                      onClick={handleCopyPrd}
                      className="text-xs font-heading font-bold text-[#f8fafc] hover:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      {isCopiedPrd ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <article className="prose prose-slate prose-invert max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-p:font-body prose-li:font-body prose-a:text-indigo-400">
                    <ReactMarkdown>{prdResult}</ReactMarkdown>
                  </article>
                </div>
              </div>

              {/* Chat & Nav */}
              <div className="lg:w-2/5 w-full h-full flex flex-col gap-6">
                <div className="flex-1 bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
                  <div className="px-6 py-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between flex-shrink-0">
                    <h2 className="font-heading text-base font-extrabold text-[#f8fafc]">Revision Chat</h2>
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isRevising ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <span className="font-body text-[10px] text-white/70">{isRevising ? 'Revising...' : 'AI Ready'}</span>
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-sm shadow-md' : 'bg-[#1e293b]/80 backdrop-blur-md border border-white/10 text-[#f8fafc] rounded-bl-sm shadow-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isRevising && (
                      <div className="flex justify-start">
                        <div className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/10 bg-[#1e293b]/50 backdrop-blur-md">
                    <div className="flex gap-2">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={handleChatKeyDown}
                        placeholder="Ketik permintaan revisi..."
                        rows={1}
                        className="flex-1 bg-[#0a0f25]/60 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-[#f8fafc] placeholder:text-white/40 focus:outline-none focus:border-indigo-400 resize-none shadow-inner"
                        disabled={isRevising}
                      />
                      <button
                        onClick={handleRevise}
                        disabled={isRevising || !chatInput.trim()}
                        className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                   <button
                    onClick={() => setStep(4)}
                    disabled={!flowchartResult}
                    className="w-full lg:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-heading font-bold text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-colors flex items-center justify-center gap-2"
                  >
                    Lanjutkan ke Task List &gt;
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && flowchartResult && (
            <div className="w-full h-full flex flex-col flex-1 animate-in fade-in duration-300 relative">
              <div className="flex-1 bg-[#0a0f25]/50 backdrop-blur-xl overflow-hidden flex flex-col relative min-h-[calc(100vh-80px)] border-t border-white/10">
                <div className="absolute inset-0">
                  <TaskDiagram markdown={flowchartResult} />
                </div>
                
                {/* Header overlay */}
                <div className="absolute top-6 left-6 z-10 bg-[#1e293b]/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                  <h2 className="font-heading text-lg font-extrabold text-[#f8fafc]">Development Tasks</h2>
                  <div className="h-4 w-[1px] bg-white/20"></div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => downloadMarkdown(flowchartResult, `Tasks-${new Date().getTime()}.md`)}
                      className="text-xs font-heading font-bold text-[#f8fafc] hover:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                      Download .md
                    </button>
                    <button
                      onClick={handleCopyTasks}
                      className="text-xs font-heading font-bold text-[#f8fafc] hover:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      {isCopiedTasks ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                </div>

                {/* Selesai Button Overlay */}
                <div className="absolute bottom-8 right-8 z-[60] flex gap-3 shadow-2xl">
                  <button
                    onClick={resetAll}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-heading font-bold text-sm shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-colors"
                  >
                    Selesai & Buat Proyek Baru
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        {step !== 2 && step !== 4 && (
          <footer className="w-full py-6 text-center relative z-10 flex-shrink-0">
            <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
              &copy; 2026 by Adji.DEV
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
