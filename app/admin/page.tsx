'use client';

import React, { useState, useEffect } from 'react';
import { getAdminDashboardData } from './actions';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    revenue: 0,
    totalTokensUsed: 0
  });
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminDashboardData();
        if (result.success && result.data) {
          setMetrics(result.data.metrics);
          setProfiles(result.data.profiles);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
            Total Pengguna Terdaftar
          </h3>
          <p className="font-heading font-extrabold text-4xl text-[#f8fafc]">
            {isLoading ? '...' : metrics.totalUsers.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
              Update Real-time
            </span>
          </div>
        </div>

        <div className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <h3 className="font-heading font-bold text-sm text-white/70 uppercase tracking-wider mb-2">
            Potensi Pendapatan (Rp)
          </h3>
          <p className="font-heading font-extrabold text-4xl text-[#f8fafc]">
            {isLoading ? '...' : `Rp ${(metrics.revenue / 1000000).toFixed(1)}M`}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              +{metrics.activeSubscribers} Subscriptions
            </span>
          </div>
        </div>

        <div className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
          <h3 className="font-heading font-bold text-sm text-white/70 uppercase tracking-wider mb-2">
            Token API Terpakai
          </h3>
          <p className="font-heading font-extrabold text-4xl text-[#f8fafc]">
            {isLoading ? '...' : metrics.totalTokensUsed.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-rose-400 font-bold text-xs bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
              -2%
            </span>
            <span className="text-xs font-body text-white/50">dari kuota bulanan</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10">
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
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/50">Loading data...</td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-white/50">Belum ada pelanggan terdaftar.</td>
                  </tr>
                ) : (
                  profiles.map((user, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-[#f8fafc] flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 text-xs">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span>{user.full_name || 'Tanpa Nama'}</span>
                          <span className="text-xs font-normal text-white/40">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-white/70">
                        {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 border font-bold text-[10px] rounded uppercase tracking-wider ${
                          user.subscription_status === 'active' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}>
                          {user.subscription_status || 'Inactive'}
                        </span>
                      </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-xs font-bold transition-colors">
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
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
