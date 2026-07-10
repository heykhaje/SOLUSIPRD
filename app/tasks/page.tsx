'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import ReactMarkdown from 'react-markdown';

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('solusiprd_flowchart'); // still using same key for compatibility
    if (stored) setTasks(stored);
  }, []);

  const handleCopy = async () => {
    if (tasks) {
      await navigator.clipboard.writeText(tasks);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (tasks) {
      const blob = new Blob([tasks], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Tasks-${new Date().getTime()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen relative flex flex-col font-body bg-[#060918] text-[#f8fafc]">
      <DitherBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="w-full bg-[#0a0f25]/40 backdrop-blur-md border-b border-white/10 px-6 py-4 flex-shrink-0 sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="flex items-center gap-0 hover:opacity-80 transition-opacity">
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
              </button>
            </div>
            <div className="flex items-center gap-3">
              {tasks && (
                <>
                  <button
                    onClick={handleDownload}
                    className="text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#1e293b]/40 backdrop-blur-md border border-white/10 text-[#f8fafc] hover:border-indigo-400 transition-colors flex items-center gap-1.5"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download .md
                  </button>
                  <button
                    onClick={handleCopy}
                    className="text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[#f8fafc] transition-colors"
                  >
                    {isCopied ? 'Copied!' : 'Copy Tasks'}
                  </button>
                </>
              )}
              <button
                onClick={handleBack}
                className="text-xs font-heading font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#1e293b]/40 backdrop-blur-md border border-white/10 transition-colors"
              >
                ← Kembali ke PRD
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-6 lg:p-10">
          {!tasks ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <h2 className="font-heading font-extrabold text-xl text-[#f8fafc] mb-2">
                  Belum Ada Task List
                </h2>
                <p className="font-body text-white/70 text-sm mb-6">
                  Generate PRD terlebih dahulu untuk melihat daftar tugas.
                </p>
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm rounded-xl shadow-lg transition-colors"
                >
                  ← Kembali
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-4xl mx-auto w-full bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center gap-2 flex-shrink-0">
                <h2 className="font-heading text-base font-extrabold text-[#f8fafc]">Development Task List</h2>
              </div>
              <div className="flex-1 relative overflow-y-auto custom-scrollbar p-8">
                <article className="prose prose-slate prose-invert max-w-none prose-headings:font-heading prose-headings:font-extrabold prose-p:font-body prose-li:font-body prose-a:text-indigo-400">
                  <ReactMarkdown>{tasks}</ReactMarkdown>
                </article>
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
