'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const steps = [
  { number: 1, label: 'Ideation', icon: '💡' },
  { number: 2, label: 'Clarify', icon: '💬' },
  { number: 3, label: 'Features', icon: '🧩' },
  { number: 4, label: 'PRD', icon: '📄' },
  { number: 5, label: 'Tasks', icon: '✅' },
];

export default function StepIndicator({ currentStep, className = '' }: StepIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-0 ${className}`}>
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={`
                  w-12 h-12 flex items-center justify-center
                  border-2\.5 border-[#1e1e1e] rounded-xl
                  font-heading font-bold text-sm
                  transition-all duration-200
                  ${
                    isCompleted
                      ? 'bg-emerald-300 text-[#1e1e1e] shadow-brutal-xs'
                      : isActive
                        ? 'bg-indigo-400 text-white shadow-brutal-sm -translate-y-0.5'
                        : 'bg-white text-[#b5b0a8]'
                  }
                `}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <span className="text-base">{step.icon}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-heading font-semibold tracking-widest uppercase ${
                  isActive
                    ? 'text-indigo-600'
                    : isCompleted
                      ? 'text-[#1e1e1e]'
                      : 'text-[#b5b0a8]'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex items-center pb-6 mx-1.5">
                <div
                  className={`w-10 md:w-16 h-0 border-t-[2.5px] ${
                    isCompleted
                      ? 'border-solid border-[#1e1e1e]'
                      : 'border-dashed border-[#d6d0c8]'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
