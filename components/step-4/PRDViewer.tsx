'use client';

import React from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import Button from '@/components/ui/Button';
import { dummyPRD } from '@/data/dummy';

interface PRDViewerProps {
  onReviseSection?: (sectionName: string) => void;
}

const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-rose-200', text: 'text-rose-700', label: 'High' },
  medium: { bg: 'bg-amber-200', text: 'text-amber-700', label: 'Medium' },
  low: { bg: 'bg-emerald-200', text: 'text-emerald-700', label: 'Low' },
};

export default function PRDViewer({ onReviseSection }: PRDViewerProps) {
  const prd = dummyPRD;

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
      {/* ═══ Header ═══ */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-1 border-2 border-[#1e1e1e] rounded-lg bg-rose-200 font-heading font-bold text-[10px] uppercase tracking-widest">
              📝 {prd.status}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 border-2 border-[#d6d0c8] rounded-lg bg-white font-body text-[10px] text-[#a39584]">
              v1.0
            </span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-[#1e1e1e] leading-tight">
            {prd.projectName}
          </h1>
          <p className="font-body text-[#78716c] text-sm mt-1">{prd.tagline}</p>
        </div>
      </div>

      {/* ═══ Latar Belakang ═══ */}
      <SectionBlock
        title="Latar Belakang"
        icon="📋"
        accentColor="indigo"
        onRevise={() => onReviseSection?.('latar belakang')}
      >
        <div className="font-body text-[#44403c] text-sm leading-[1.75] whitespace-pre-line">
          {prd.background}
        </div>
      </SectionBlock>

      {/* ═══ User Roles ═══ */}
      <SectionBlock
        title="User Roles"
        icon="👥"
        accentColor="amber"
        onRevise={() => onReviseSection?.('user roles')}
      >
        <div className="space-y-3">
          {prd.userRoles.map((role, idx) => {
            const colors = ['indigo', 'amber', 'mint'] as const;
            const shadowColor = colors[idx % colors.length];
            const bgColors = ['indigo', 'yellow', 'lime'] as const;
            return (
              <BrutalCard key={idx} className="!p-4" color={bgColors[idx % bgColors.length]} shadowColor={shadowColor}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 border-2 border-[#1e1e1e] rounded-lg bg-white flex items-center justify-center font-heading font-extrabold text-sm">
                    {idx + 1}
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#1e1e1e]">
                    {role.role}
                  </h4>
                </div>
                <p className="font-body text-[#57534e] text-xs mb-3 leading-relaxed">
                  {role.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.map((perm, pIdx) => (
                    <span
                      key={pIdx}
                      className="inline-block px-2 py-0.5 border-[1.5px] border-[#1e1e1e] rounded-md bg-white font-body text-[11px] text-[#57534e]"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </BrutalCard>
            );
          })}
        </div>
      </SectionBlock>

      {/* ═══ Spesifikasi Fitur ═══ */}
      <SectionBlock
        title="Spesifikasi Fitur"
        icon="⚡"
        accentColor="coral"
        onRevise={() => onReviseSection?.('spesifikasi fitur')}
      >
        <div className="space-y-3">
          {prd.features.map((feature) => {
            const p = priorityConfig[feature.priority];
            return (
              <BrutalCard key={feature.id} className="!p-4" hover>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex-shrink-0 font-heading font-extrabold text-[10px] text-[#a39584] border-2 border-[#d6d0c8] rounded-md px-2 py-0.5 bg-[#faf9f6]">
                      {feature.id}
                    </span>
                    <h4 className="font-heading font-bold text-[15px] text-[#1e1e1e] leading-snug">
                      {feature.name}
                    </h4>
                  </div>
                  <span
                    className={`flex-shrink-0 inline-block px-2 py-0.5 border-[1.5px] border-[#1e1e1e] rounded-md font-heading font-bold text-[10px] uppercase tracking-wider ${p.bg} ${p.text}`}
                  >
                    {p.label}
                  </span>
                </div>
                <p className="font-body text-[#57534e] text-sm mb-3 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.subFeatures.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5 font-body text-sm text-[#44403c]">
                      <span className="flex-shrink-0 w-5 h-5 border-[1.5px] border-[#1e1e1e] rounded-md bg-emerald-100 flex items-center justify-center text-[10px] mt-0.5">
                        ✓
                      </span>
                      {sub}
                    </li>
                  ))}
                </ul>
              </BrutalCard>
            );
          })}
        </div>
      </SectionBlock>

      {/* ═══ Tech Stack ═══ */}
      <SectionBlock
        title="Tech Stack"
        icon="🛠️"
        accentColor="mint"
        onRevise={() => onReviseSection?.('tech stack')}
      >
        <div className="grid grid-cols-2 gap-2.5">
          {prd.techStack.map((tech, idx) => {
            const accents = ['indigo', 'coral', 'amber', 'mint'] as const;
            const cardColors = ['indigo', 'pink', 'yellow', 'lime'] as const;
            return (
              <BrutalCard
                key={idx}
                className="!p-3.5"
                hover
                color={cardColors[idx % cardColors.length]}
                shadowColor={accents[idx % accents.length]}
              >
                <div className="font-heading font-extrabold text-sm text-[#1e1e1e]">
                  {tech.name}
                </div>
                <div className="inline-block px-1.5 py-0.5 border-[1.5px] border-[#1e1e1e] rounded bg-white font-heading text-[9px] text-[#78716c] uppercase tracking-widest mt-1">
                  {tech.category}
                </div>
                <div className="font-body text-[11px] text-[#57534e] mt-2 leading-relaxed">
                  {tech.reason}
                </div>
              </BrutalCard>
            );
          })}
        </div>
      </SectionBlock>

      {/* ═══ Timeline ═══ */}
      <SectionBlock
        title="Timeline"
        icon="📅"
        accentColor="amber"
        onRevise={() => onReviseSection?.('timeline')}
      >
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[18px] top-4 bottom-4 w-[2.5px] bg-[#1e1e1e] rounded-full" />

          <div className="space-y-4">
            {prd.timeline.map((milestone, idx) => {
              const colors = ['indigo', 'lime', 'yellow', 'pink'] as const;
              const shadows = ['indigo', 'mint', 'amber', 'coral'] as const;
              return (
                <div key={idx} className="flex gap-4">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-9 h-9 border-2\.5 border-[#1e1e1e] rounded-xl bg-white flex items-center justify-center font-heading font-extrabold text-sm shadow-brutal-xs">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <BrutalCard className="flex-1 !p-4" color={colors[idx % colors.length]} shadowColor={shadows[idx % shadows.length]}>
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <span className="font-heading font-extrabold text-base text-[#1e1e1e]">
                          {milestone.phase}
                        </span>
                        <span className="font-heading font-semibold text-sm text-[#57534e] ml-2">
                          — {milestone.title}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 border-[1.5px] border-[#1e1e1e] rounded-md bg-white font-heading font-bold text-[10px]">
                        ⏱ {milestone.duration}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {milestone.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-2.5 font-body text-sm text-[#44403c]">
                          <span className="w-5 h-5 border-[1.5px] border-[#1e1e1e] rounded bg-white flex items-center justify-center text-[10px] flex-shrink-0 font-heading font-bold text-[#a39584]">
                            {tIdx + 1}
                          </span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </BrutalCard>
                </div>
              );
            })}
          </div>
        </div>
      </SectionBlock>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Section Block — reusable wrapper
   ════════════════════════════════════════════════════════════ */

interface SectionBlockProps {
  title: string;
  icon: string;
  accentColor: 'indigo' | 'coral' | 'amber' | 'mint';
  children: React.ReactNode;
  onRevise?: () => void;
}

const accentMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  coral: 'bg-rose-500',
  amber: 'bg-amber-500',
  mint: 'bg-emerald-500',
};

function SectionBlock({ title, icon, accentColor, children, onRevise }: SectionBlockProps) {
  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-1.5 h-6 rounded-full ${accentMap[accentColor]}`} />
          <span className="text-lg">{icon}</span>
          <h2 className="font-heading text-lg font-extrabold text-[#1e1e1e]">
            {title}
          </h2>
        </div>
        {onRevise && (
          <Button variant="ghost" size="xs" onClick={onRevise}>
            ✏️ Revise
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
