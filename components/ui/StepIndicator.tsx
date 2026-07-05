'use client';

import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const steps = [
  { number: 1, label: 'Ideation', icon: '💡' },
  { number: 2, label: 'Clarify', icon: '💬' },
  { number: 3, label: 'Features', icon: '🗂️' },
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
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`
                  w-11 h-11 flex items-center justify-center
                  border-3 border-neutral-900 font-heading font-bold text-sm
                  transition-all duration-150
                  ${
                    isCompleted
                      ? 'bg-lime-300 text-neutral-900'
                      : isActive
                        ? 'bg-amber-300 text-neutral-900 shadow-brutal-sm'
                        : 'bg-white text-neutral-400'
                  }
                `}
              >
                {isCompleted ? '✓' : step.icon}
              </div>
              <span
                className={`text-xs font-body font-medium tracking-wide uppercase ${
                  isActive ? 'text-neutral-900' : isCompleted ? 'text-neutral-700' : 'text-neutral-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex items-center pb-6 mx-1">
                <div
                  className={`w-8 md:w-14 h-0 border-t-3 border-dashed ${
                    isCompleted ? 'border-neutral-900' : 'border-neutral-300'
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
