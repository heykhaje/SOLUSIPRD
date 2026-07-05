'use client';

import React from 'react';

interface ChatBubbleProps {
  role: 'user' | 'ai';
  message: string;
  timestamp?: string;
}

export default function ChatBubble({ role, message, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-1'}`}>
        {/* Role label */}
        <div
          className={`text-xs font-heading font-bold uppercase tracking-wider mb-1.5 ${
            isUser ? 'text-right text-neutral-500' : 'text-left text-neutral-500'
          }`}
        >
          {isUser ? 'You' : '🤖 AI Assistant'}
        </div>

        {/* Bubble */}
        <div
          className={`
            border-3 border-neutral-900 p-4
            font-body text-sm leading-relaxed
            ${
              isUser
                ? 'bg-lime-200 shadow-brutal-sm'
                : 'bg-white shadow-brutal-sm'
            }
          `}
        >
          {message}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div
            className={`text-xs text-neutral-400 mt-1.5 font-body ${
              isUser ? 'text-right' : 'text-left'
            }`}
          >
            {timestamp}
          </div>
        )}
      </div>
    </div>
  );
}
