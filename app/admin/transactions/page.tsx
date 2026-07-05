'use client';

import React from 'react';

export default function TransactionsPage() {
  return (
    <div className="p-8 lg:p-12 space-y-10 w-full">
      <header>
        <h2 className="font-heading font-extrabold text-3xl text-[#f8fafc] tracking-tight">
          Riwayat Transaksi
        </h2>
        <p className="font-body text-white/60 mt-1">
          Laporan pemasukan dan langganan bulanan dari pengguna.
        </p>
      </header>

      <section className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M7 15h0" />
              <path d="M2 9.5h20" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-lg text-white/70 mb-2">Belum Ada Transaksi</h3>
          <p className="text-sm font-body text-white/40 max-w-sm">
            Saat ini belum ada data pembayaran. Sistem payment gateway (seperti Midtrans atau Stripe) akan segera diintegrasikan di sini.
          </p>
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
