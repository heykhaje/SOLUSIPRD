'use client';

import React, { useState, useEffect } from 'react';
import { getAdminDashboardData, getSystemPrompt, updateSystemPrompt } from './actions';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    revenue: 0,
    totalTokensUsed: 0
  });
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result, promptResult] = await Promise.all([
          getAdminDashboardData(),
          getSystemPrompt()
        ]);
        
        if (result.success && result.data) {
          setMetrics(result.data.metrics);
          setProfiles(result.data.profiles);
        }

        if (promptResult.success && promptResult.prompt) {
          setSystemPrompt(promptResult.prompt);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTierLabel = (status: string | null) => {
    switch (status) {
      case 'basic': return { label: 'Basic', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'pro': return { label: 'Pro', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'max': return { label: 'Max', color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' };
      case 'active': return { label: 'Active', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      default: return { label: 'Inactive', color: 'text-white/50 bg-white/5 border-white/10' };
    }
  };

  const getTierPrice = (status: string | null) => {
    switch (status) {
      case 'basic': return 'Rp 50.000 / minggu';
      case 'pro': return 'Rp 100.000 / bulan';
      case 'max': return 'Rp 130.000 / bulan';
      default: return 'Belum berlangganan';
    }
  };

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

      {/* System Prompt Editor */}
      <section className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-md flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">
            Pengaturan System Prompt AI
          </h3>
          {promptMessage.text && (
            <span className={`text-xs font-bold px-3 py-1 rounded-md ${promptMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {promptMessage.text}
            </span>
          )}
        </div>
        <div className="p-6 flex flex-col gap-4">
          <p className="font-body text-sm text-white/60">
            Prompt ini adalah "otak" utama dari AI Generator PRD Anda. Anda bisa menyesuaikan aturan, struktur, dan gaya bahasa yang digunakan AI saat menghasilkan output.
          </p>
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
            <p className="font-heading font-bold text-xs text-rose-400 mb-1">⚠️ PERINGATAN PENTING</p>
            <p className="font-body text-xs text-white/70">
              Anda wajib mempertahankan tulisan <strong>---TASKS_SEPARATOR---</strong> dan instruksi tentang <strong>DAFTAR TUGAS</strong> di dalam prompt ini agar alur "Lanjutkan ke PRD" tidak rusak/error.
            </p>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-80 bg-white/5 border border-white/10 rounded-xl p-4 font-mono text-sm text-white/80 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all custom-scrollbar"
            placeholder="Tulis system prompt di sini..."
          />
          <div className="flex justify-end">
            <button
              onClick={async () => {
                setIsSavingPrompt(true);
                setPromptMessage({ text: 'Menyimpan...', type: 'success' });
                const res = await updateSystemPrompt(systemPrompt);
                if (res.success) {
                  setPromptMessage({ text: 'Prompt berhasil disimpan!', type: 'success' });
                  setTimeout(() => setPromptMessage({ text: '', type: '' }), 3000);
                } else {
                  setPromptMessage({ text: 'Gagal menyimpan prompt.', type: 'error' });
                }
                setIsSavingPrompt(false);
              }}
              disabled={isSavingPrompt || isLoading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSavingPrompt ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
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
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Tanggal Bergabung</th>
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Paket</th>
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Status</th>
                  <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/50">Loading data...</td>
                  </tr>
                ) : profiles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-white/50">Belum ada pelanggan terdaftar.</td>
                  </tr>
                ) : (
                  profiles.map((user, idx) => {
                    const tier = getTierLabel(user.subscription_status);
                    return (
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
                        <span className={`inline-flex px-2.5 py-1 border font-bold text-[10px] rounded-lg uppercase tracking-wider ${tier.color}`}>
                          {tier.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 border font-bold text-[10px] rounded uppercase tracking-wider ${
                          user.subscription_status && user.subscription_status !== 'inactive'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}>
                          {user.subscription_status && user.subscription_status !== 'inactive' ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-xs font-bold transition-colors"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div
            className="bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">Detail Pelanggan</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-5">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                {selectedUser.avatar_url ? (
                  <img src={selectedUser.avatar_url} alt={selectedUser.full_name} className="w-14 h-14 rounded-full border-2 border-indigo-500/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl font-bold">
                    {selectedUser.full_name?.charAt(0) || selectedUser.email?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <p className="font-heading font-extrabold text-lg text-[#f8fafc]">{selectedUser.full_name || 'Tanpa Nama'}</p>
                  <p className="font-body text-sm text-white/50">{selectedUser.email}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-heading font-bold text-[10px] text-white/50 uppercase tracking-wider mb-1">Paket Langganan</p>
                  <span className={`inline-flex px-2.5 py-1 border font-bold text-xs rounded-lg uppercase tracking-wider ${getTierLabel(selectedUser.subscription_status).color}`}>
                    {getTierLabel(selectedUser.subscription_status).label}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-heading font-bold text-[10px] text-white/50 uppercase tracking-wider mb-1">Harga Paket</p>
                  <p className="font-heading font-bold text-sm text-[#f8fafc]">{getTierPrice(selectedUser.subscription_status)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-heading font-bold text-[10px] text-white/50 uppercase tracking-wider mb-1">Tanggal Bergabung</p>
                  <p className="font-heading font-bold text-sm text-[#f8fafc]">
                    {new Date(selectedUser.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-heading font-bold text-[10px] text-white/50 uppercase tracking-wider mb-1">Token Terpakai</p>
                  <p className="font-heading font-bold text-sm text-[#f8fafc]">{selectedUser.tokens_used?.toLocaleString() || 0}</p>
                </div>
              </div>

              {/* User ID */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="font-heading font-bold text-[10px] text-white/50 uppercase tracking-wider mb-1">User ID (Supabase)</p>
                <p className="font-mono text-xs text-white/70 break-all">{selectedUser.id}</p>
              </div>

              {/* Status */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="font-heading font-bold text-[10px] text-white/50 uppercase tracking-wider mb-1">Status Akun</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    selectedUser.subscription_status && selectedUser.subscription_status !== 'inactive'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                      : 'bg-white/30'
                  }`} />
                  <span className="font-heading font-bold text-sm text-[#f8fafc]">
                    {selectedUser.subscription_status && selectedUser.subscription_status !== 'inactive' ? 'Aktif & Berlangganan' : 'Belum Berlangganan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full pt-8 pb-4 text-center">
        <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
          &copy; 2026 by Adji.DEV
        </p>
      </footer>
    </div>
  );
}
