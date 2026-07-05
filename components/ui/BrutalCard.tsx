'use client';

import React from 'react';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'yellow' | 'pink' | 'lime' | 'blue' | 'orange' | 'indigo' | 'cream';
  hover?: boolean;
  noPadding?: boolean;
  shadowColor?: 'black' | 'indigo' | 'coral' | 'amber' | 'mint';
  rounded?: boolean;
}

const colorMap: Record<string, string> = {
  white: 'bg-white',
  cream: 'bg-[#faf9f6]',
  yellow: 'bg-amber-200',
  pink: 'bg-rose-200',
  lime: 'bg-emerald-200',
  blue: 'bg-sky-200',
  orange: 'bg-orange-200',
  indigo: 'bg-indigo-200',
};

const shadowMap: Record<string, string> = {
  black: 'shadow-brutal',
  indigo: 'shadow-brutal-indigo',
  coral: 'shadow-brutal-coral',
  amber: 'shadow-brutal-amber',
  mint: 'shadow-brutal-mint',
};

const hoverShadowMap: Record<string, string> = {
  black: 'hover:shadow-brutal-lg',
  indigo: 'hover:shadow-[8px_8px_0px_#6366f1]',
  coral: 'hover:shadow-[8px_8px_0px_#f43f5e]',
  amber: 'hover:shadow-[8px_8px_0px_#f59e0b]',
  mint: 'hover:shadow-[8px_8px_0px_#10b981]',
};

export default function BrutalCard({
  children,
  className = '',
  color = 'white',
  hover = false,
  noPadding = false,
  shadowColor = 'black',
  rounded = true,
}: BrutalCardProps) {
  return (
    <div
      className={`
        border-2\.5 border-[#1e1e1e]
        ${shadowMap[shadowColor] || 'shadow-brutal'}
        ${colorMap[color] || 'bg-white'}
        ${rounded ? 'rounded-xl' : ''}
        ${noPadding ? '' : 'p-6'}
        ${hover ? `transition-all duration-150 ${hoverShadowMap[shadowColor]} hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1` : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
