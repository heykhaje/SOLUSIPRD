'use client';

import DitherBackground from '@/components/backgrounds/DitherBackground';
import StepIndicator from '@/components/ui/StepIndicator';
import ClarificationChat from '@/components/step-2/ClarificationChat';

export default function Step2Page() {
  return (
    <div className="min-h-screen h-screen relative flex flex-col">
      <DitherBackground />

      <div className="relative z-10 flex flex-col h-full">
        {/* ═══ Header ═══ */}
        <header className="w-full border-b-3 border-[#1e1e1e] bg-white px-6 py-3.5 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
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
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-[#1e1e1e] rounded-lg bg-indigo-200 font-heading font-bold text-[10px] uppercase tracking-wider shadow-brutal-xs">
                💬 Clarification Phase
              </span>
            </div>
          </div>
        </header>

        {/* ═══ Step Indicator ═══ */}
        <div className="w-full bg-white/90 border-b-3 border-[#1e1e1e] px-6 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <StepIndicator currentStep={2} />
          </div>
        </div>

        {/* ═══ Main ═══ */}
        <main className="flex-1 flex items-stretch justify-center px-6 py-8 min-h-0">
          <ClarificationChat />
        </main>

        {/* ═══ Footer ═══ */}
        <footer className="w-full border-t-3 border-[#1e1e1e] bg-white px-6 py-2.5 flex-shrink-0">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="font-body text-[11px] text-[#b5b0a8]">
              © 2026 KHAJEAI — Built for developers who ship fast
            </span>
            <div className="flex items-center gap-3">
              <span className="hidden md:inline font-body text-[11px] text-[#b5b0a8]">
                💡 Answer the questions or click suggestions for quick reply
              </span>
              <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-[#b5b0a8]">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                Step 2 of 5
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
