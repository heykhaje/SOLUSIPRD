'use client';

import React, { useState } from 'react';

export default function AdminDashboardPage() {
  const [aiPrompt, setAiPrompt] = useState(
    'Anda adalah AI asisten untuk membantu menulis PRD (Product Requirements Document)...'
  );

  return (
    <div className="p-8 lg:p-12 space-y-10">
      {/* Header */}
      <header>
        <h2 className="font-heading font-extrabold text-3xl text-[#f8fafc] tracking-tight">
          Selamat datang, Adji
        </h2>
        <p className="font-body text-white/60 mt-1">
          Berikut adalah ringkasan performa aplikasi Anda hari ini.
        </p>
      </header>

      {/* 3 Metrics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <h3 className="font-heading font-bold text-sm text-white/70 uppercase tracking-wider mb-2">
            Total Pelanggan Aktif
          </h3>
          <p className="font-heading font-extrabold text-4xl text-[#f8fafc]">
            1,284
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              +12%
            </span>
            <span className="text-xs font-body text-white/50">dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <h3 className="font-heading font-bold text-sm text-white/70 uppercase tracking-wider mb-2">
            Pendapatan Bulan Ini (Rp)
          </h3>
          <p className="font-heading font-extrabold text-4xl text-[#f8fafc]">
            45.2M
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              +8.5%
            </span>
            <span className="text-xs font-body text-white/50">dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <h3 className="font-heading font-bold text-sm text-white/70 uppercase tracking-wider mb-2">
            Token API Terpakai
          </h3>
          <p className="font-heading font-extrabold text-4xl text-[#f8fafc]">
            8.4M
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-rose-400 font-bold text-xs bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
              -2%
            </span>
            <span className="text-xs font-body text-white/50">dari kuota bulanan</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Tabel Pelanggan Terbaru */}
        <section className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md">
            <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">
              Pelanggan Terbaru
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Nama Pelanggan</th>
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Tanggal Pembayaran</th>
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-white/5">
                {[
                  { name: 'Budi Santoso', date: '05 Jul 2026', status: 'Aktif' },
                  { name: 'Sarah Wijaya', date: '04 Jul 2026', status: 'Aktif' },
                  { name: 'Alex Pradana', date: '02 Jul 2026', status: 'Aktif' },
                  { name: 'Diana Fitri', date: '01 Jul 2026', status: 'Aktif' },
                ].map((user, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-[#f8fafc]">{user.name}</td>
                    <td className="p-4 text-white/70">{user.date}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded uppercase tracking-wider">
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-xs font-bold transition-colors">
                          Detail
                        </button>
                        <button className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-colors">
                          Blokir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Konfigurasi AI (Preview) */}
        <section className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md">
            <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">
              Konfigurasi AI
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
                rows={8}
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
      </div>
      <footer className="w-full pt-8 pb-4 text-center">
        <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
          &copy; 2026 by Khaje&apos;Studio
        </p>
      </footer>
    </div>
  );
}
