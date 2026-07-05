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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}>
      <div className="max-w-[85%]">
        {/* Avatar + Role */}
        <div
          className={`flex items-center gap-2 mb-1.5 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          {!isUser && (
            <div className="w-6 h-6 rounded-lg border-2 border-[#1e1e1e] bg-indigo-300 flex items-center justify-center text-xs">
              🤖
            </div>
          )}
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#a39584]">
            {isUser ? 'You' : 'AI Assistant'}
          </span>
          {isUser && (
            <div className="w-6 h-6 rounded-lg border-2 border-[#1e1e1e] bg-amber-300 flex items-center justify-center text-xs">
              👤
            </div>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`
            border-2\.5 border-[#1e1e1e] p-4 rounded-xl
            font-body text-sm leading-relaxed
            ${
              isUser
                ? 'bg-indigo-100 shadow-[3px_3px_0px_#6366f1]'
                : 'bg-white shadow-brutal-sm'
            }
          `}
        >
          <p className="text-[#1e1e1e] whitespace-pre-wrap">{message}</p>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <div
            className={`text-[10px] text-[#b5b0a8] mt-1.5 font-body ${
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
