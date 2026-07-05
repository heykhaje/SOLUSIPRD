'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import Button from '@/components/ui/Button';
import ChatBubble from '@/components/ui/ChatBubble';
import { welcomeMessage, dummyRevisionResponses } from '@/data/dummy';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}

interface RevisionChatProps {
  pendingRevision?: string | null;
  onClearPending?: () => void;
}

export default function RevisionChat({ pendingRevision, onClearPending }: RevisionChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Set welcome message on client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMessages([{ ...welcomeMessage, timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleClear = useCallback(() => {
    onClearPending?.();
  }, [onClearPending]);

  useEffect(() => {
    if (pendingRevision) {
      setInputValue(`Tolong revisi bagian "${pendingRevision}" dari PRD.`);
      inputRef.current?.focus();
      handleClear();
    }
  }, [pendingRevision, handleClear]);

  const getTimestamp = () =>
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(dummyRevisionResponses)) {
      if (key !== 'default' && lower.includes(key)) return response;
    }
    return dummyRevisionResponses['default'];
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      message: trimmed,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        message: getAIResponse(trimmed),
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-[#e7e0d5]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 border-2\.5 border-[#1e1e1e] rounded-xl bg-indigo-400 flex items-center justify-center shadow-brutal-xs">
            <span className="text-white text-sm">💬</span>
          </div>
          <div>
            <h2 className="font-heading text-base font-extrabold text-[#1e1e1e] leading-none">
              Revision Chat
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-emerald-400 border-[1.5px] border-[#1e1e1e] rounded-full pulse-soft" />
              <span className="font-body text-[10px] text-[#a39584]">AI online</span>
            </div>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-1 border-2 border-[#1e1e1e] rounded-lg bg-emerald-200 font-heading font-bold text-[10px] uppercase tracking-wider shadow-brutal-xs">
          🤖 Assistant
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            message={msg.message}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[85%]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg border-2 border-[#1e1e1e] bg-indigo-300 flex items-center justify-center text-xs">
                  🤖
                </div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-[#a39584]">
                  AI Assistant
                </span>
              </div>
              <div className="border-2\.5 border-[#1e1e1e] bg-white p-4 rounded-xl shadow-brutal-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-indigo-400 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="pt-4 mt-auto border-t-2 border-[#e7e0d5]">
        {/* Quick actions */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {['Revise fitur', 'Tambah section', 'Ubah timeline'].map((q) => (
            <button
              key={q}
              onClick={() => setInputValue(q)}
              className="flex-shrink-0 px-3 py-1.5 border-2 border-[#d6d0c8] rounded-lg bg-white font-body text-[11px] text-[#78716c] hover:border-[#1e1e1e] hover:text-[#1e1e1e] hover:shadow-brutal-xs transition-all duration-150 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2.5">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik revisi yang diinginkan..."
            rows={2}
            className="flex-1 border-2\.5 border-[#1e1e1e] rounded-xl bg-white p-3.5 font-body text-sm text-[#1e1e1e] placeholder:text-[#c4b5a4] shadow-brutal-xs focus:shadow-brutal focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150 resize-none"
          />
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="self-end"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <kbd className="px-1.5 py-0.5 border-[1.5px] border-[#d6d0c8] rounded bg-white font-heading text-[9px] text-[#b5b0a8] font-bold shadow-[1px_1px_0px_#e7e0d5]">
            Enter
          </kbd>
          <span className="text-[10px] font-body text-[#c4b5a4]">send</span>
          <span className="text-[10px] text-[#d6d0c8]">·</span>
          <kbd className="px-1.5 py-0.5 border-[1.5px] border-[#d6d0c8] rounded bg-white font-heading text-[9px] text-[#b5b0a8] font-bold shadow-[1px_1px_0px_#e7e0d5]">
            Shift+Enter
          </kbd>
          <span className="text-[10px] font-body text-[#c4b5a4]">new line</span>
        </div>
      </div>
    </div>
  );
}
