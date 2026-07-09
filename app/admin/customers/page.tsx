'use client';

import React, { useState, useEffect } from 'react';
import { getAdminDashboardData, updateUserSubscription } from '../actions';

export default function CustomersPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

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

  const handleRevokeAccess = async (userId: string) => {
    setIsRevoking(true);
    try {
      const result = await updateUserSubscription(userId, null);
      if (result.success) {
        setProfiles(prev => prev.map(p => p.id === userId ? { ...p, subscription_status: null } : p));
        setRevokeConfirm(null);
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => prev ? { ...prev, subscription_status: null } : null);
        }
      } else {
        alert('Gagal mencabut akses: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Terjadi kesalahan saat mencabut akses.');
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-10 w-full">
      <header>
        <h2 className="font-heading font-extrabold text-3xl text-[#f8fafc] tracking-tight">
          Pelanggan Aktif (Paid)
        </h2>
        <p className="font-body text-white/60 mt-1">
          Daftar seluruh pelanggan yang telah mendaftar di SolusiPRD.
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
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Paket</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Status</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Token Terpakai</th>
                <th className="p-4 font-heading font-bold text-xs text-white/60 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">Memuat data dari Supabase...</td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">Belum ada pelanggan terdaftar.</td>
                </tr>
              ) : (
                profiles.map((user, idx) => {
                  const tier = getTierLabel(user.subscription_status);
                  return (
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
                      <span className={`inline-flex px-2.5 py-1 border font-bold text-[10px] rounded-lg uppercase tracking-wider ${tier.color}`}>
                        {tier.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 border font-bold text-[10px] rounded uppercase tracking-wider ${
                        user.subscription_status && user.subscription_status !== 'inactive'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-white/5 border-white/10 text-white/50'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.subscription_status && user.subscription_status !== 'inactive' ? 'bg-emerald-400' : 'bg-white/30'
                        }`} />
                        {user.subscription_status && user.subscription_status !== 'inactive' ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="p-4 text-white/70 font-mono">
                      {user.tokens_used?.toLocaleString() || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] border border-white/10 rounded-lg text-xs font-bold transition-colors"
                        >
                          Lihat Detail
                        </button>
                        {user.subscription_status && user.subscription_status !== 'inactive' && (
                          <button
                            onClick={() => setRevokeConfirm(user.id)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-colors"
                          >
                            Cabut Akses
                          </button>
                        )}
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
            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              {selectedUser.subscription_status && selectedUser.subscription_status !== 'inactive' && (
                <button
                  onClick={() => { setSelectedUser(null); setRevokeConfirm(selectedUser.id); }}
                  className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-heading font-bold text-sm rounded-xl transition-colors"
                >
                  Cabut Akses
                </button>
              )}
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

      {/* Revoke Confirmation Modal */}
      {revokeConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => !isRevoking && setRevokeConfirm(null)}>
          <div
            className="bg-[#0f1629] border border-rose-500/20 rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="font-heading font-extrabold text-lg text-[#f8fafc]">Cabut Akses Langganan?</h3>
              <p className="font-body text-sm text-white/60">
                Aksi ini akan mencabut status langganan pengguna. Pengguna tidak akan bisa mengakses fitur berbayar sampai berlangganan kembali.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRevokeConfirm(null)}
                  disabled={isRevoking}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleRevokeAccess(revokeConfirm)}
                  disabled={isRevoking}
                  className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isRevoking ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Mencabut...
                    </>
                  ) : 'Ya, Cabut Akses'}
                </button>
              </div>
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
