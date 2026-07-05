'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BrutalCard from '@/components/ui/BrutalCard';
import Button from '@/components/ui/Button';
import ChatBubble from '@/components/ui/ChatBubble';
import { clarificationQuestions, clarificationResponses } from '@/data/dummy';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export default function ClarificationChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getTimestamp = () =>
    new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Send initial AI greeting + first question
  useEffect(() => {
    if (hasStarted) return;
    setHasStarted(true);

    const greeting: ChatMessage = {
      id: 'greeting',
      role: 'ai',
      message:
        'Halo! 👋 Terima kasih sudah mengirimkan ide Anda. Sebelum saya membuatkan PRD, saya perlu mengajukan beberapa pertanyaan untuk memperjelas kebutuhan teknis dan bisnis.',
      timestamp: getTimestamp(),
    };
    setMessages([greeting]);

    // First question after short delay
    setTimeout(() => {
      const q = clarificationQuestions[0];
      const questionMsg: ChatMessage = {
        id: `ai-q-${q.id}`,
        role: 'ai',
        message: `**Pertanyaan 1 dari ${clarificationQuestions.length}**\n\n${q.question}\n\n_💡 Konteks: ${q.context}_`,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, questionMsg]);
    }, 600);
  }, [hasStarted]);

  const handleSend = useCallback((text?: string) => {
    const trimmed = (text || inputValue).trim();
    if (!trimmed || isTyping || isComplete) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      message: trimmed,
      timestamp: getTimestamp(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const currentQ = clarificationQuestions[currentQuestionIdx];
    const nextIdx = currentQuestionIdx + 1;

    setTimeout(() => {
      // AI acknowledges the answer
      const responseText =
        clarificationResponses[currentQ.id] || clarificationResponses['default'];
      const aiResponse: ChatMessage = {
        id: `ai-resp-${Date.now()}`,
        role: 'ai',
        message: responseText,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      if (nextIdx < clarificationQuestions.length) {
        // Ask next question
        setCurrentQuestionIdx(nextIdx);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const nextQ = clarificationQuestions[nextIdx];
            const nextQuestionMsg: ChatMessage = {
              id: `ai-q-${nextQ.id}`,
              role: 'ai',
              message: `**Pertanyaan ${nextIdx + 1} dari ${clarificationQuestions.length}**\n\n${nextQ.question}\n\n_💡 Konteks: ${nextQ.context}_`,
              timestamp: getTimestamp(),
            };
            setMessages((prev) => [...prev, nextQuestionMsg]);
            setIsTyping(false);
          }, 600);
        }, 400);
      } else {
        // All questions answered
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const completeMsg: ChatMessage = {
              id: 'ai-complete',
              role: 'ai',
              message:
                '✅ Sempurna! Saya sudah mendapatkan semua informasi yang diperlukan. Sekarang saya akan menyusun peta fitur (Feature Map) berdasarkan jawaban Anda.\n\nKlik tombol di bawah untuk melanjutkan ke Feature Mapping.',
              timestamp: getTimestamp(),
            };
            setMessages((prev) => [...prev, completeMsg]);
            setIsTyping(false);
            setIsComplete(true);
          }, 800);
        }, 300);
      }
    }, 800);
  }, [inputValue, isTyping, isComplete, currentQuestionIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentQ = clarificationQuestions[currentQuestionIdx];
  const progress = isComplete
    ? 100
    : ((currentQuestionIdx) / clarificationQuestions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full">
      <BrutalCard shadowColor="indigo" className="flex flex-col flex-1 min-h-0 relative overflow-hidden !p-0">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-[#e7e0d5] bg-white flex items-center justify-between flex-shrink-0 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2\.5 border-[#1e1e1e] rounded-xl bg-indigo-400 flex items-center justify-center shadow-brutal-xs">
              <span className="text-white text-sm">💬</span>
            </div>
            <div>
              <h2 className="font-heading text-base font-extrabold text-[#1e1e1e] leading-none">
                AI Clarification
              </h2>
              <span className="font-body text-[10px] text-[#a39584]">
                {isComplete
                  ? '✅ All questions answered'
                  : `Question ${currentQuestionIdx + 1} of ${clarificationQuestions.length}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 border-[1.5px] border-[#1e1e1e] rounded-full pulse-soft" />
            <span className="font-body text-[10px] text-[#a39584]">AI Active</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[#f0ece4] flex-shrink-0">
          <div
            className="h-full bg-indigo-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
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

        {/* Input area */}
        <div className="px-6 py-4 border-t-2 border-[#e7e0d5] bg-white/80 flex-shrink-0 rounded-b-xl">
          {isComplete ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => router.push('/steps/step-3')}
            >
              View Feature Map →
            </Button>
          ) : (
            <>
              {/* Suggestion chips */}
              {!isTyping && currentQ && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentQ.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputValue(suggestion);
                        setTimeout(() => handleSend(suggestion), 100);
                      }}
                      className="px-3 py-2 border-2 border-[#d6d0c8] rounded-lg bg-white font-body text-[12px] text-[#57534e] hover:border-[#1e1e1e] hover:text-[#1e1e1e] hover:shadow-brutal-xs hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-150 cursor-pointer text-left leading-snug"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2.5">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik jawaban Anda atau pilih suggestion di atas..."
                  rows={2}
                  disabled={isTyping}
                  className="flex-1 border-2\.5 border-[#1e1e1e] rounded-xl bg-white p-3.5 font-body text-sm text-[#1e1e1e] placeholder:text-[#c4b5a4] shadow-brutal-xs focus:shadow-brutal focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all duration-150 resize-none disabled:opacity-50"
                />
                <Button
                  variant="primary"
                  onClick={() => handleSend()}
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
                <span className="text-[10px] font-body text-[#c4b5a4]">
                  or click a suggestion above
                </span>
              </div>
            </>
          )}
        </div>
      </BrutalCard>
    </div>
  );
}
