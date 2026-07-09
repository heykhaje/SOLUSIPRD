'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import UserFlowDiagram from '@/components/UserFlowDiagram';

export default function FlowchartPage() {
  const router = useRouter();
  const [flowchart, setFlowchart] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('solusiprd_flowchart');
    if (stored) setFlowchart(stored);
  }, []);

  const handleCopy = async () => {
    if (flowchart) {
      const mermaidBlock = '```mermaid\n' + flowchart + '\n```';
      await navigator.clipboard.writeText(mermaidBlock);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
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
              {flowchart && (
                <>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className={`text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${
                      showCode
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-[#1e293b]/40 backdrop-blur-md border-white/10 text-[#f8fafc] hover:border-indigo-400'
                    }`}
                  >
                    {showCode ? 'Diagram' : 'Code'}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-[#1e293b]/40 backdrop-blur-md border border-white/10 text-[#f8fafc] hover:border-indigo-400 transition-colors"
                  >
                    {isCopied ? 'Copied!' : 'Copy Mermaid'}
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
          {!flowchart ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
                <h2 className="font-heading font-extrabold text-xl text-[#f8fafc] mb-2">
                  Belum Ada Flowchart
                </h2>
                <p className="font-body text-white/70 text-sm mb-6">
                  Generate PRD terlebih dahulu untuk melihat User Flow diagram.
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
            <div className="flex-1 bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center gap-2 flex-shrink-0">
                <h2 className="font-heading text-base font-extrabold text-[#f8fafc]">User Flow Diagram</h2>
              </div>
              <div className="flex-1 relative min-h-[500px]">
                {showCode ? (
                  <div className="absolute inset-0 p-6 overflow-y-auto custom-scrollbar">
                    <div className="absolute inset-0 p-6 bg-[#060918]">
                      <pre className="h-full w-full p-6 rounded-xl bg-[#0a0f25]/80 text-[#a7f3d0] font-mono text-sm overflow-auto custom-scrollbar border border-white/10 shadow-inner">
                        <code>{flowchart}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0">
                    <UserFlowDiagram mermaidCode={flowchart} />
                  </div>
                )}
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
