'use client';

import { useState, useCallback } from 'react';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import StepIndicator from '@/components/ui/StepIndicator';
import PRDViewer from '@/components/step-4/PRDViewer';
import RevisionChat from '@/components/step-4/RevisionChat';
import Button from '@/components/ui/Button';

export default function Step4Page() {
  const [pendingRevision, setPendingRevision] = useState<string | null>(null);

  const handleReviseSection = useCallback((sectionName: string) => {
    setPendingRevision(sectionName);
  }, []);

  const handleClearPending = useCallback(() => {
    setPendingRevision(null);
  }, []);

  return (
    <div className="min-h-screen h-screen relative flex flex-col">
      <DitherBackground />

      <div className="relative z-10 flex flex-col h-full">
        {/* ═══ Header ═══ */}
        <header className="w-full border-b-3 border-[#1e1e1e] bg-white px-6 py-3.5 flex-shrink-0">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border-2\.5 border-[#1e1e1e] rounded-xl bg-indigo-400 shadow-brutal-xs flex items-center justify-center font-heading font-extrabold text-sm text-white">
                K
              </div>
              <div>
                <span className="font-heading font-extrabold text-base tracking-tight text-[#1e1e1e] block leading-none">
                  KHAJEAI
                </span>
                <span className="font-body text-[9px] text-[#a39584] tracking-wider uppercase">
                  PRD Generator
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#1e1e1e] rounded-lg bg-rose-200 font-heading font-bold text-[10px] uppercase tracking-wider shadow-brutal-xs">
                📝 Draft
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#1e1e1e] rounded-lg bg-emerald-200 font-heading font-bold text-[10px] uppercase tracking-wider shadow-brutal-xs">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full pulse-soft" />
                Auto-saved
              </span>
              <Button variant="accent" size="xs" className="hidden lg:inline-flex">
                Next Step →
              </Button>
            </div>
          </div>
        </header>

        {/* ═══ Step Indicator ═══ */}
        <div className="w-full bg-white/90 border-b-3 border-[#1e1e1e] px-6 py-3.5 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <StepIndicator currentStep={4} />
          </div>
        </div>

        {/* ═══ Split Screen ═══ */}
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left: PRD Viewer */}
          <div className="lg:w-[58%] w-full border-b-3 lg:border-b-0 lg:border-r-3 border-[#1e1e1e] bg-white/70 overflow-hidden flex flex-col">
            {/* Panel header */}
            <div className="px-6 py-3 border-b-2 border-[#e7e0d5] bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 border-2 border-[#1e1e1e] rounded-lg bg-amber-200 flex items-center justify-center shadow-brutal-xs">
                    <span className="text-sm">📄</span>
                  </div>
                  <h2 className="font-heading text-sm font-extrabold text-[#1e1e1e] uppercase tracking-wide">
                    PRD Document
                  </h2>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 border-[1.5px] border-[#d6d0c8] rounded-md bg-[#faf9f6] font-body text-[10px] text-[#a39584]">
                    6 sections
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 border-[1.5px] border-[#d6d0c8] rounded-md bg-[#faf9f6] font-body text-[10px] text-[#a39584]">
                    ~1.2k words
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <PRDViewer onReviseSection={handleReviseSection} />
            </div>
          </div>

          {/* Right: Revision Chat */}
          <div className="lg:w-[42%] w-full bg-[#faf9f6]/90 overflow-hidden flex flex-col">
            <div className="flex-1 p-5 flex flex-col min-h-0">
              <RevisionChat
                pendingRevision={pendingRevision}
                onClearPending={handleClearPending}
              />
            </div>
          </div>
        </main>

        {/* ═══ Footer ═══ */}
        <footer className="w-full border-t-3 border-[#1e1e1e] bg-white px-6 py-2.5 flex-shrink-0">
          <div className="max-w-[1800px] mx-auto flex items-center justify-between">
            <span className="font-body text-[11px] text-[#b5b0a8]">
              © 2026 KHAJEAI
            </span>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline font-body text-[11px] text-[#b5b0a8]">
                💡 Click ✏️ Revise on any section to edit via chat
              </span>
              <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-[#b5b0a8]">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                Step 4 of 5
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
