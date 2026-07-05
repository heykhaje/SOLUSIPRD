'use client';

import DitherBackground from '@/components/backgrounds/DitherBackground';
import StepIndicator from '@/components/ui/StepIndicator';
import IdeationForm from '@/components/step-1/IdeationForm';

export default function Step1Page() {
  return (
    <div className="min-h-screen relative">
      <DitherBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ═══ Header ═══ */}
        <header className="w-full border-b-3 border-[#1e1e1e] bg-white px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2\.5 border-[#1e1e1e] rounded-xl bg-indigo-400 shadow-brutal-xs flex items-center justify-center font-heading font-extrabold text-base text-white">
                K
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-[#1e1e1e] block leading-none">
                  KHAJEAI
                </span>
                <span className="font-body text-[10px] text-[#a39584] tracking-wider uppercase">
                  PRD Generator
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#1e1e1e] rounded-lg bg-amber-200 font-heading font-bold text-[10px] uppercase tracking-wider shadow-brutal-xs">
                ⚡ AI-Powered
              </span>
              <span className="hidden md:inline-flex items-center px-3 py-1.5 border-2 border-[#d6d0c8] rounded-lg font-body text-[10px] text-[#a39584] uppercase tracking-wider">
                v1.0
              </span>
            </div>
          </div>
        </header>

        {/* ═══ Step Indicator ═══ */}
        <div className="w-full bg-white/90 border-b-3 border-[#1e1e1e] px-6 py-5">
          <div className="max-w-4xl mx-auto">
            <StepIndicator currentStep={1} />
          </div>
        </div>

        {/* ═══ Main ═══ */}
        <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-16">
          <IdeationForm />
        </main>

        {/* ═══ Footer ═══ */}
        <footer className="w-full border-t-3 border-[#1e1e1e] bg-white px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span className="font-body text-[11px] text-[#b5b0a8]">
              © 2026 KHAJEAI — Built for developers who ship fast
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-[#b5b0a8]">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                Step 1 of 5
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
