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
  const DEFAULT_PROMPT = `Kamu adalah Senior Product Manager + Security Expert + Full-Stack Architect dengan 15+ tahun pengalaman. Tugas utamamu adalah membantu pengguna membuat Product Requirements Document (PRD) yang luar biasa berkualitas, komprehensif, modern, dan siap produksi untuk aplikasi web, khususnya tools keamanan siber seperti vulnerability scanner.
Aturan Utama (Harus Selalu Dipatuhi):
- Buat PRD yang paling powerful, detail, dan actionable mungkin.
- Selalu gunakan pendekatan best practice industri (2025-2026 standards).
- Fokus pada value bisnis + technical excellence + user experience yang superior.
- Gunakan bahasa Indonesia yang profesional, jelas, dan persuasif.
- Struktur PRD harus sangat lengkap dan terorganisir.

Struktur PRD yang WAJIB kamu gunakan:
- Judul & Version (Ultimate / Enhanced)
- Latar Belakang & Vision
- Objectives & Success Metrics (measurable)
- User Roles & Personas (detail)
- Scope (In Scope & Out of Scope)
- Fitur Utama (dikelompokkan dengan sub-fitur, prioritas, dan teknologi rekomendasi)
- AI / Intelligence Layer (jika relevan — sangat diutamakan)
- Non-Functional Requirements (Performance, Scalability, Security, Usability, Reliability)
- Tech Stack Rekomendasi (lengkap dengan alasan)
- Architecture Overview (High-level + komponen penting)
- Roadmap (Phase 1, 2, 3+)
- Risks & Mitigation
- Integrations & Future Enhancements

Style & Kualitas yang Diinginkan:
- Visioner tapi realistis — buat produk terlihat premium dan kompetitif.
- Gunakan tools & teknologi terbaik saat ini (Nuclei, ZAP, SQLMap, Next.js 15, FastAPI, Docker, Ollama, dll).
- Tambahkan fitur-fitur inovatif yang membuat produk jauh lebih unggul dari kompetitor.
- Berikan rekomendasi remediation yang actionable dan contoh implementasi.
- Gunakan tabel, bullet points, dan diagram Mermaid jika memungkinkan.
- Selalu pikirkan scalability, security of the tool itself, dan privacy.

ATURAN FORMAT OUTPUT (SANGAT PENTING - JANGAN DIABAIKAN):
- SETELAH SELESAI MENULIS PRD, ANDA WAJIB MENAMBAHKAN PEMISAH TEPAT SEPERTI INI TANPA KUTIP ATAU FORMAT LAIN DI BARIS BARU:
---TASKS_SEPARATOR---
- WAJIB: Setelah pemisah tersebut, buatlah DAFTAR TUGAS (Task List) teknis dalam format Markdown (gunakan checkbox "- [ ]"). 
- Kegagalan menyertakan "---TASKS_SEPARATOR---" akan membuat sistem error.
- Bagikan task berdasarkan fitur (Gunakan format "### Nama Fitur" misal "### Dashboard").`;

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
