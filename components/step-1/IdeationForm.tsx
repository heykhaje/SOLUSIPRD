'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import Button from '@/components/ui/Button';
import { techStackOptions, platformOptions } from '@/data/dummy';

export default function IdeationForm() {
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [techStack, setTechStack] = useState('ai-decide');
  const [platform, setPlatform] = useState('web');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setIsSubmitting(true);
    localStorage.setItem(
      'khajeai-ideation',
      JSON.stringify({ idea, techStack, platform })
    );
    setTimeout(() => router.push('/steps/step-2'), 600);
  };

  const charCount = idea.length;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <BrutalCard shadowColor="indigo" className="relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute -top-3 -right-3 w-24 h-24 bg-amber-300 rounded-2xl border-2\.5 border-[#1e1e1e] rotate-12 opacity-80" />
        <div className="absolute -top-1 -right-1 w-16 h-16 bg-rose-300 rounded-xl border-2\.5 border-[#1e1e1e] rotate-6 opacity-60" />
        <div className="absolute top-4 right-5 text-2xl z-10 drop-shadow-sm">💡</div>

        {/* Bottom left decoration */}
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-indigo-200 rounded-full border-2\.5 border-[#1e1e1e] opacity-30" />

        {/* Content */}
        <div className="relative z-10">
          {/* Heading */}
          <div className="mb-8 pr-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#1e1e1e] rounded-lg bg-indigo-100 mb-4">
              <span className="w-2 h-2 bg-indigo-500 rounded-full pulse-soft" />
              <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-indigo-700">
                Step 1 — Ideation
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#1e1e1e] leading-tight mb-3">
              What do you want
              <br />
              <span className="gradient-text">to build?</span>
            </h1>
            <p className="font-body text-[#78716c] text-base leading-relaxed">
              Describe your app idea below. Be as detailed or as brief as you like — our AI will help clarify the rest.
            </p>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <label
              htmlFor="idea-input"
              className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-[#78716c] mb-2.5"
            >
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Your Idea
            </label>
            <div className={`transition-all duration-150 ${isFocused ? '-translate-x-0.5 -translate-y-0.5' : ''}`}>
              <textarea
                id="idea-input"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Saya ingin membuat aplikasi booking studio musik yang memungkinkan musisi menemukan, membooking, dan membayar sewa studio secara online..."
                rows={5}
                className={`
                  w-full border-2\.5 border-[#1e1e1e] rounded-xl bg-white p-4
                  font-body text-base text-[#1e1e1e] placeholder:text-[#c4b5a4]
                  focus:outline-none resize-none
                  transition-shadow duration-150
                  ${isFocused ? 'shadow-brutal-lg' : 'shadow-brutal-sm'}
                `}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs font-body text-[#b5b0a8]">
                Bahasa Indonesia atau English — both work!
              </span>
              <span
                className={`text-xs font-heading font-bold tabular-nums ${
                  charCount > 0 ? 'text-indigo-500' : 'text-[#c4b5a4]'
                }`}
              >
                {charCount}
              </span>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label
                htmlFor="tech-stack"
                className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-[#78716c] mb-2.5"
              >
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                Tech Stack
              </label>
              <div className="relative">
                <select
                  id="tech-stack"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="w-full border-2\.5 border-[#1e1e1e] rounded-xl bg-white p-3.5 pr-10 font-body text-sm text-[#1e1e1e] shadow-brutal-xs focus:shadow-brutal focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150 cursor-pointer appearance-none"
                >
                  {techStackOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#78716c]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="platform"
                className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-widest text-[#78716c] mb-2.5"
              >
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                Platform
              </label>
              <div className="relative">
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border-2\.5 border-[#1e1e1e] rounded-xl bg-white p-3.5 pr-10 font-body text-sm text-[#1e1e1e] shadow-brutal-xs focus:shadow-brutal focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150 cursor-pointer appearance-none"
                >
                  {platformOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#78716c]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!idea.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2\.5 border-white border-t-transparent rounded-full brutal-spinner" />
                Generating...
              </span>
            ) : (
              <>Generate PRD<span className="ml-1">→</span></>
            )}
          </Button>

          {/* Shortcut hint */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <kbd className="px-2 py-0.5 border-2 border-[#d6d0c8] rounded-md bg-white font-heading text-[10px] text-[#a39584] font-bold shadow-[1px_1px_0px_#d6d0c8]">
              ⌘ Enter
            </kbd>
            <span className="text-[10px] font-body text-[#b5b0a8]">to submit</span>
          </div>
        </div>
      </BrutalCard>

      {/* Decorative floating badges below card */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {['🔒 Secure', '⚡ Fast', '🤖 AI-Powered'].map((badge) => (
          <span
            key={badge}
            className="inline-flex items-center px-3 py-1.5 border-2 border-[#d6d0c8] rounded-full bg-white font-body text-[11px] text-[#a39584]"
          >
            {badge}
          </span>
        ))}
      </div>
    </form>
  );
}
