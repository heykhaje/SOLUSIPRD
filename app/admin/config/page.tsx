'use client';

import React, { useState } from 'react';

export default function AIConfigPage() {
  const [aiPrompt, setAiPrompt] = useState(
    'Anda adalah AI asisten untuk membantu menulis PRD (Product Requirements Document)...'
  );

  return (
    <div className="p-8 lg:p-12 space-y-10 w-full">
      <header>
        <h2 className="font-heading font-extrabold text-3xl text-[#f8fafc] tracking-tight">
          Konfigurasi AI
        </h2>
        <p className="font-body text-white/60 mt-1">
          Atur instruksi bawaan (System Prompt) untuk mesin AI Gemini Anda.
        </p>
      </header>

      <section className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md">
          <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">
            Pengaturan System Prompt
          </h3>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-heading font-bold text-sm text-[#f8fafc] uppercase tracking-wide">
              System Prompt Utama
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              rows={12}
              className="w-full bg-[#060918]/60 backdrop-blur-md border border-white/10 focus:border-indigo-400 rounded-xl p-4 font-body text-sm text-[#f8fafc] placeholder:text-white/40 shadow-inner focus:outline-none transition-colors resize-none custom-scrollbar"
            />
            <p className="text-xs font-body text-white/50">
              Prompt ini akan di-inject ke setiap sesi baru pembuatan PRD oleh user. 
            </p>
          </div>
          
          <div className="mt-2 flex justify-end">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm rounded-xl shadow-lg transition-colors">
              Simpan Konfigurasi
            </button>
          </div>
        </div>
      </section>
      
      <footer className="w-full pt-8 pb-4 text-center">
        <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
          &copy; 2026 by Khaje&apos;Studio
        </p>
      </footer>
    </div>
  );
}
