'use client';

import React from 'react';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'white' | 'yellow' | 'pink' | 'lime' | 'blue' | 'orange';
  hover?: boolean;
  noPadding?: boolean;
}

const colorMap: Record<string, string> = {
  white: 'bg-white',
  yellow: 'bg-amber-300',
  pink: 'bg-pink-300',
  lime: 'bg-lime-300',
  blue: 'bg-blue-300',
  orange: 'bg-orange-300',
};

export default function BrutalCard({
  children,
  className = '',
  color = 'white',
  hover = false,
  noPadding = false,
}: BrutalCardProps) {
  return (
    <div
      className={`
        border-3 border-neutral-900 
        shadow-brutal
        ${colorMap[color] || 'bg-white'}
        ${noPadding ? '' : 'p-6'}
        ${hover ? 'transition-all duration-150 hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
