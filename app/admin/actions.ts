'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function getAdminDashboardData() {
  const supabase = createAdminClient();

  try {
    // Fetch all profiles from public.profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return { success: false, error: error.message };
    }

    // Calculate metrics
    const totalUsers = profiles?.length || 0;
    
    // In a real app, revenue would be calculated from a transactions or subscriptions table.
    // For now, we simulate it based on total active users (e.g., 100k per user per month).
    const activeSubscribers = profiles?.filter(p => p.subscription_status === 'active').length || 0;
    // Just mock some revenue and token usage logic to make the dashboard look alive based on user count
    // Since this is 100% paid app, ideally we will have a real payment gateway soon.
    const revenue = totalUsers * 150000; // Mock Rp 150.000 per user
    
    // Sum tokens_used from all users
    const totalTokensUsed = profiles?.reduce((acc, curr) => acc + (curr.tokens_used || 0), 0) || 0;

    return {
      success: true,
      data: {
        profiles: profiles || [],
        metrics: {
          totalUsers,
          activeSubscribers,
          revenue,
          totalTokensUsed,
        },
      }
    };
  } catch (err: any) {
    console.error('Unexpected error in getAdminDashboardData:', err);
    return { success: false, error: err.message };
  }
}

export async function updateUserSubscription(userId: string, status: string | null) {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: status })
      .eq('id', userId);

    if (error) {
      console.error('Error updating subscription:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in updateUserSubscription:', err);
    return { success: false, error: err.message };
  }
}

export async function getSystemPrompt() {
  const supabase = createAdminClient();
  const DEFAULT_PROMPT = `Anda adalah Product Manager senior. Ubah ide mentah ini menjadi dokumen PRD lengkap berformat Markdown yang berisi:
1) Latar Belakang
2) User Roles
3) Spesifikasi Fitur

ATURAN FORMAT OUTPUT (SANGAT PENTING):
- Berikan dokumen PRD dalam format Markdown standar yang rapi.
- SETELAH SELESAI MENULIS PRD, ANDA WAJIB MENAMBAHKAN PEMISAH TEPAT SEPERTI INI TANPA KUTIP ATAU FORMAT LAIN:
---TASKS_SEPARATOR---
- WAJIB: Setelah pemisah tersebut, buatlah DAFTAR TUGAS (Task List) teknis dalam format Markdown (gunakan checkbox "- [ ]"). 
- Kegagalan menyertakan "---TASKS_SEPARATOR---" akan membuat sistem error. Jangan sampai lupa!
- Bagikan task berdasarkan fitur atau halaman (misal: "### Autentikasi", "### Database", dll).`;

  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'system_prompt')
      .maybeSingle();

    if (error) {
      console.error('Error fetching system prompt:', error);
      return { success: false, prompt: DEFAULT_PROMPT };
    }

    if (!data) {
      return { success: true, prompt: DEFAULT_PROMPT };
    }

    return { success: true, prompt: data.value };
  } catch (err: any) {
    console.error('Unexpected error in getSystemPrompt:', err);
    return { success: false, prompt: DEFAULT_PROMPT };
  }
}

export async function updateSystemPrompt(newPrompt: string) {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ 
        key: 'system_prompt', 
        value: newPrompt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.error('Error updating system prompt:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in updateSystemPrompt:', err);
    return { success: false, error: err.message };
  }
}
