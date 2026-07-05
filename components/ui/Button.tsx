'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-amber-300 border-3 border-neutral-900 shadow-brutal text-neutral-900 hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1',
  secondary:
    'bg-white border-3 border-neutral-900 shadow-brutal text-neutral-900 hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1',
  danger:
    'bg-pink-300 border-3 border-neutral-900 shadow-brutal text-neutral-900 hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1',
  ghost:
    'bg-transparent border-2 border-neutral-400 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-heading font-bold uppercase tracking-wide
        transition-all duration-150 cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed !shadow-none !translate-x-0 !translate-y-0' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
