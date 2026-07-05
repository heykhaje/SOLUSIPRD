'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import Button from '@/components/ui/Button';
import { featureTree, type FeatureNode } from '@/data/dummy';

const priorityConfig: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  core: { bg: 'bg-rose-200', text: 'text-rose-700', label: 'Core', dot: 'bg-rose-500' },
  important: { bg: 'bg-amber-200', text: 'text-amber-700', label: 'Important', dot: 'bg-amber-500' },
  'nice-to-have': { bg: 'bg-emerald-200', text: 'text-emerald-700', label: 'Nice-to-have', dot: 'bg-emerald-500' },
};

const cardShadows = ['indigo', 'coral', 'amber', 'mint', 'indigo', 'coral'] as const;
const cardColors = ['indigo', 'pink', 'yellow', 'lime', 'blue', 'orange'] as const;

export default function FeatureMap() {
  const router = useRouter();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(featureTree.map((f) => f.id)) // all expanded by default
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Stats
  const totalFeatures = featureTree.reduce(
    (acc, f) => acc + 1 + (f.children?.length || 0),
    0
  );
  const coreCount = featureTree.reduce(
    (acc, f) =>
      acc +
      (f.priority === 'core' ? 1 : 0) +
      (f.children?.filter((c) => c.priority === 'core').length || 0),
    0
  );
  const importantCount = featureTree.reduce(
    (acc, f) =>
      acc +
      (f.priority === 'important' ? 1 : 0) +
      (f.children?.filter((c) => c.priority === 'important').length || 0),
    0
  );
  const niceCount = totalFeatures - coreCount - importantCount;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#1e1e1e] rounded-lg bg-emerald-200 mb-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-soft" />
          <span className="font-heading font-bold text-[10px] uppercase tracking-widest text-emerald-700">
            Step 3 — Feature Mapping
          </span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-[#1e1e1e] leading-tight mb-2">
          Your App&apos;s
          <span className="gradient-text"> Feature Map</span>
        </h1>
        <p className="font-body text-[#78716c] text-base max-w-xl mx-auto">
          Berikut adalah struktur fitur yang kami susun berdasarkan ide dan jawaban klarifikasi Anda.
          Review dan lanjutkan jika sudah sesuai.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <BrutalCard className="!py-2.5 !px-4 inline-flex items-center gap-2" shadowColor="indigo">
          <span className="font-heading font-extrabold text-xl text-[#1e1e1e]">{totalFeatures}</span>
          <span className="font-body text-xs text-[#78716c]">Total Features</span>
        </BrutalCard>
        <BrutalCard className="!py-2.5 !px-4 inline-flex items-center gap-2" color="pink" shadowColor="coral">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
          <span className="font-heading font-bold text-sm text-[#1e1e1e]">{coreCount}</span>
          <span className="font-body text-xs text-[#78716c]">Core</span>
        </BrutalCard>
        <BrutalCard className="!py-2.5 !px-4 inline-flex items-center gap-2" color="yellow" shadowColor="amber">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
          <span className="font-heading font-bold text-sm text-[#1e1e1e]">{importantCount}</span>
          <span className="font-body text-xs text-[#78716c]">Important</span>
        </BrutalCard>
        <BrutalCard className="!py-2.5 !px-4 inline-flex items-center gap-2" color="lime" shadowColor="mint">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          <span className="font-heading font-bold text-sm text-[#1e1e1e]">{niceCount}</span>
          <span className="font-body text-xs text-[#78716c]">Nice-to-have</span>
        </BrutalCard>
      </div>

      {/* Feature Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {featureTree.map((module, idx) => {
          const isExpanded = expandedIds.has(module.id);
          const p = priorityConfig[module.priority];

          return (
            <BrutalCard
              key={module.id}
              className="!p-0 overflow-hidden"
              shadowColor={cardShadows[idx % cardShadows.length]}
              color={cardColors[idx % cardColors.length]}
            >
              {/* Module header — clickable */}
              <button
                onClick={() => toggleExpand(module.id)}
                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-white/30 transition-colors duration-150 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl flex-shrink-0">{module.icon}</span>
                  <div className="min-w-0">
                    <h3 className="font-heading font-extrabold text-[15px] text-[#1e1e1e] leading-snug">
                      {module.name}
                    </h3>
                    <p className="font-body text-[11px] text-[#57534e] mt-0.5 leading-snug">
                      {module.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span
                    className={`inline-block px-2 py-0.5 border-[1.5px] border-[#1e1e1e] rounded-md font-heading font-bold text-[9px] uppercase tracking-wider ${p.bg} ${p.text}`}
                  >
                    {p.label}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="#1e1e1e"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              {/* Children — collapsible */}
              {isExpanded && module.children && (
                <div className="border-t-2 border-[#1e1e1e]/15 bg-white/50">
                  {module.children.map((child, cIdx) => (
                    <FeatureChildItem
                      key={child.id}
                      feature={child}
                      isLast={cIdx === (module.children?.length ?? 0) - 1}
                    />
                  ))}
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
        <Button variant="secondary" size="md" onClick={() => router.push('/steps/step-2')}>
          ← Back to Clarify
        </Button>
        <Button variant="primary" size="lg" onClick={() => router.push('/steps/step-4')}>
          Looks Good — Generate PRD →
        </Button>
      </div>

      <p className="text-center font-body text-[11px] text-[#b5b0a8] mb-8">
        You can revise the features later in the PRD editor
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   Feature Child Item
   ════════════════════════════════════════════ */

function FeatureChildItem({
  feature,
  isLast,
}: {
  feature: FeatureNode;
  isLast: boolean;
}) {
  const p = priorityConfig[feature.priority];

  return (
    <div
      className={`px-5 py-3 flex items-center gap-3 ${
        !isLast ? 'border-b border-[#1e1e1e]/10' : ''
      } hover:bg-white/40 transition-colors duration-100`}
    >
      {/* Connector */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-px h-4 bg-[#1e1e1e]/20" />
        <span className="text-base">{feature.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-heading font-bold text-[13px] text-[#1e1e1e] leading-snug">
          {feature.name}
        </div>
        <div className="font-body text-[11px] text-[#78716c] leading-snug mt-0.5">
          {feature.description}
        </div>
      </div>

      {/* Priority dot */}
      <span
        className={`flex-shrink-0 w-2 h-2 rounded-full ${p.dot}`}
        title={p.label}
      />
    </div>
  );
}
