'use client';

import React, { useState } from 'react';
import DitherBackground from '@/components/backgrounds/DitherBackground';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleMockGoogleLogin = () => {
    setIsLoading(true);
    // Simulate network request for Google Auth
    setTimeout(() => {
      // Set a mock authentication cookie that lasts for 1 day
      document.cookie = "solusiprd_auth=true; path=/; max-age=86400; SameSite=Lax";
      // Force a full page reload to trigger middleware and redirect to home
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-body bg-[#060918] text-[#f8fafc] overflow-hidden">
      <DitherBackground />

      <div className="relative z-10 w-full max-w-md p-6 animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0a0f25]/50 backdrop-blur-xl border border-white/10 shadow-[0_16px_64px_rgba(0,0,0,0.5)] rounded-3xl p-10 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-2xl" />
          </div>
          
          <h1 className="font-heading font-extrabold text-3xl tracking-tight text-[#f8fafc] mb-2">
            Welcome to SOLUSIPRD
          </h1>
          <p className="font-body text-white/60 mb-10 text-sm">
            Sign in to start generating professional Product Requirements Documents.
          </p>

          <button
            onClick={handleMockGoogleLogin}
            disabled={isLoading}
            className="w-full relative flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#1e1e1e] font-heading font-bold text-base py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-[#1e1e1e]/30 border-t-[#1e1e1e] rounded-full animate-spin" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 48 48" className="flex-shrink-0">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571c.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>
          
          <div className="mt-8 text-center border-t border-white/5 pt-6 w-full">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-heading font-bold">
              Secure Access — 100% Paid SaaS
            </p>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-6 w-full text-center z-10 pointer-events-none">
        <p className="font-heading text-xs font-bold text-white/40 tracking-wider">
          &copy; 2026 by Khaje&apos;Studio
        </p>
      </footer>
    </div>
  );
}
