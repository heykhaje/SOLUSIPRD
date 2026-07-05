'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import { createClient } from '@/utils/supabase/client';

const navigation = [
  { name: 'Overview', href: '/admin' },
  { name: 'Pelanggan Aktif (Paid)', href: '/admin/customers' },
  { name: 'Riwayat Transaksi', href: '/admin/transactions' },
  { name: 'Konfigurasi AI', href: '/admin/config' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen relative flex font-body bg-[#060918] text-[#f8fafc]">
      <DitherBackground />

      {/* Sidebar Navigasi */}
      <aside className="relative z-10 w-72 flex-shrink-0 flex flex-col bg-[#0a0f25]/50 backdrop-blur-xl border-r border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        <div className="p-8 border-b border-white/10 flex items-center justify-center">
          <h1 className="font-heading font-extrabold text-2xl tracking-tight text-[#f8fafc]">
            Khaje Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center w-full px-4 py-3 rounded-xl font-heading font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg border-transparent'
                    : 'bg-transparent text-white/70 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10 flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-full px-4 py-3 rounded-xl font-heading font-bold text-sm text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors"
          >
            ← Kembali ke App
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center w-full px-4 py-3 rounded-xl font-heading font-bold text-sm text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
