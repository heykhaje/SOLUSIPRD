'use client';

import React, { useState, useEffect } from 'react';
import { getAdminDashboardData } from '../actions';

export default function CustomersPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAdminDashboardData();
        if (result.success && result.data) {
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
    <div className="p-8 lg:p-12 space-y-10 w-full">
      <header>
        <h2 className="font-heading font-extrabold text-3xl text-[#f8fafc] tracking-tight">
          Pelanggan Aktif (Paid)
        </h2>
        <p className="font-body text-white/60 mt-1">
          Daftar seluruh pelanggan yang telah mendaftar di Khaje Studio.
        </p>
      </header>

      <section className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex justify-between items-center">
          <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">
            Database Pelanggan
          </h3>
          <span className="bg-indigo-500/20 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
            Total: {profiles.length} Users
          </span>
        </div>
        
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Nama Pelanggan</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Tanggal Bergabung</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Status Langganan</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Token Terpakai</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">Memuat data dari Supabase...</td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/50">Belum ada pelanggan terdaftar.</td>
                </tr>
              ) : (
                profiles.map((user, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-[#f8fafc] flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 text-sm">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span>{user.full_name || 'Tanpa Nama'}</span>
                        <span className="text-xs font-normal text-white/40">{user.email}</span>
                        <span className="text-[10px] text-white/30 font-mono mt-0.5">{user.id}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white/70">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
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
                    <td className="p-4 text-white/70 font-mono">
                      {user.tokens_used?.toLocaleString() || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-xs font-bold transition-colors">
                          Lihat Detail
                        </button>
                        <button className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-colors">
                          Cabut Akses
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
      
      <footer className="w-full pt-8 pb-4 text-center">
        <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
          &copy; 2026 by Khaje&apos;Studio
        </p>
      </footer>
    </div>
  );
}
