'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import DitherBackground from '@/components/backgrounds/DitherBackground';
import { createClient } from '@/utils/supabase/client';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        // Check if already active
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', data.user.id)
          .single();
          
        if (profile?.subscription_status === 'active') {
          router.push('/');
        }
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planId);
    
    try {
      // Create transaction via our API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate checkout token');
      }

      // Open Midtrans Snap UI
      if ((window as any).snap) {
        (window as any).snap.pay(result.token, {
          onSuccess: function (result: any) {
            console.log('Payment success:', result);
            alert('Pembayaran berhasil! Sistem sedang mengkonfirmasi langganan Anda.');
            router.push('/admin');
          },
          onPending: function (result: any) {
            console.log('Payment pending:', result);
            alert('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.');
          },
          onError: function (result: any) {
            console.log('Payment error:', result);
            alert('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function () {
            console.log('Customer closed the popup without finishing the payment');
          },
        });
      } else {
        alert('Midtrans Snap tidak tersedia. Mohon refresh halaman.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '50.000',
      period: 'per minggu',
      description: 'Sempurna untuk uji coba jangka pendek.',
      features: ['Akses Generator PRD (7 Hari)', 'Export Terbatas', 'Standar Antrean AI']
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '100.000',
      period: 'per bulan',
      description: 'Pilihan paling populer untuk Product Manager.',
      features: ['Akses Generator PRD (30 Hari)', 'Export Tak Terbatas', 'Prioritas Antrean AI', 'Akses Fitur Baru'],
      popular: true
    },
    {
      id: 'max',
      name: 'Max',
      price: '130.000',
      period: 'per 2 bulan',
      description: 'Akses penuh tanpa batas untuk tim profesional.',
      features: ['Akses Semua Fitur Pro', 'Respon AI Ultra Cepat', 'Prioritas Dukungan 24/7', 'Kustomisasi Prompt Khusus']
    }
  ];

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 py-16">
      {/* Midtrans Snap JS - Dynamic based on environment */}
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true' 
          ? "https://app.midtrans.com/snap/snap.js" 
          : "https://app.sandbox.midtrans.com/snap/snap.js"} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="absolute inset-0 z-0">
        <DitherBackground />
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-[#f8fafc] mb-4 tracking-tight">
          Pilih Paket Berlangganan
        </h1>
        <p className="font-body text-lg text-white/60 mb-12 max-w-xl">
          Tingkatkan produktivitas Anda dengan AI canggih. Pilih paket yang sesuai dengan kebutuhan Anda.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col bg-[#0a0f25]/50 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-2 border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.2)] md:scale-105 z-10' 
                  : 'border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white font-heading font-bold text-xs uppercase tracking-wider py-1.5 px-4 rounded-full">
                  Paling Populer
                </div>
              )}
              
              <h3 className="font-heading font-bold text-2xl text-white mb-2">{plan.name}</h3>
              <p className="font-body text-sm text-white/50 mb-6 min-h-[40px]">{plan.description}</p>
              
              <div className="flex items-end justify-center mb-8 gap-1">
                <span className="font-heading font-bold text-white/50 mb-2">Rp</span>
                <span className="font-heading font-extrabold text-5xl text-white">{plan.price}</span>
              </div>
              <p className="text-sm font-bold text-indigo-400 mb-8">{plan.period}</p>

              <ul className="space-y-4 font-body text-sm text-white/70 text-left mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading}
                className={`w-full font-heading font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                } ${isLoading && selectedPlan === plan.id ? 'opacity-80' : ''}`}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  'Pilih Paket'
                )}
              </button>
            </div>
          ))}
        </div>
        
        <p className="mt-12 text-xs text-white/30 font-body">
          Pembayaran diproses secara aman oleh Midtrans. Akses langsung diberikan setelah pembayaran berhasil.
        </p>
      </div>
    </main>
  );
}
