import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const SYSTEM_PROMPT = `Anda adalah Product Manager senior. Ubah ide mentah ini menjadi dokumen PRD lengkap berformat Markdown yang berisi:
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

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  openai: OpenAI,
  prompt: string,
  systemPrompt: string,
  maxRetries: number = 2
): Promise<string> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Trying Groq API (attempt ${attempt + 1})`);
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0].message.content || "";
    } catch (e: any) {
      lastError = e;
      const status = e?.status || 0;

      if ((status === 429 || status === 503 || status === 500) && attempt < maxRetries) {
        const waitTime = (attempt + 1) * 3000;
        console.warn(`API error ${status}, waiting ${waitTime / 1000}s...`);
        await delay(waitTime);
        continue;
      }

      console.warn(`Groq API failed: ${e.message}`);
      break;
    }
  }

  throw lastError;
}

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract Request Body
    const body = await request.json();
    const { prompt: userPrompt } = body;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return NextResponse.json(
        { error: "userPrompt is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    // 3. Fetch User Data from Supabase
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, tokens_used')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json({ error: "Failed to fetch user profile." }, { status: 500 });
    }

    const tier = profile?.subscription_status || 'free';
    const tokensUsed = profile?.tokens_used || 0;

    // Admin override (assuming admin email bypasses limits)
    const isAdmin = user.email === 'adjiprasetyo970@gmail.com';
    const effectiveTier = isAdmin ? 'max' : tier;

    // 4. Limit Validation
    let limit = 0;
    if (effectiveTier === 'basic') limit = 5;
    else if (effectiveTier === 'pro') limit = 15;
    else if (effectiveTier === 'max') limit = Infinity;
    
    // If user is 'free' or unlisted tier, we might block them or give them 0 limit
    if (effectiveTier !== 'max' && tokensUsed >= limit) {
      return NextResponse.json(
        { 
          error: "LIMIT_REACHED", 
          message: "Limit penggunaan Anda telah habis. Silakan upgrade plan Anda via Midtrans." 
        },
        { status: 403 }
      );
    }

    // 5. Call AI Generation
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey
    });
    
    let tierInstruction = "";
    if (effectiveTier === 'max') {
      tierInstruction = "INI ADALAH PELANGGAN TINGKAT MAX. Berikan detail teknis terdalam, spesifikasi paling komprehensif, arsitektur sistem lanjutan, dan analisa edge case paling lengkap. Hasilkan PRD terbaik yang pernah ada.";
    } else if (effectiveTier === 'pro') {
      tierInstruction = "INI ADALAH PELANGGAN TINGKAT PRO. Berikan detail yang sangat baik dan terstruktur rapi dengan edge cases yang jelas.";
    }

    const finalSystemPrompt = `${SYSTEM_PROMPT}\n${tierInstruction}`;
    const userMessage = `Ide Aplikasi:\n${userPrompt}`;

    const fullContent = await generateWithRetry(openai, userMessage, finalSystemPrompt);

    if (!fullContent) {
      return NextResponse.json({ error: "AI returned an empty response. Please try again." }, { status: 500 });
    }

    // 6. Increment Usage Count
    if (effectiveTier !== 'max') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tokens_used: tokensUsed + 1 })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Failed to increment usage count:", updateError);
        // Continue anyway so the user doesn't lose their generated PRD due to a DB update failure
      }
    }

    // 7. Parse PRD and Tasks from the response
    const separator = "---TASKS_SEPARATOR---";
    let prdContent = fullContent;
    let taskContent = "";

    if (fullContent.includes(separator)) {
      const parts = fullContent.split(separator);
      prdContent = parts[0].trim();
      taskContent = parts[1].trim();
    } else {
      // Fallback: If AI fails to add separator, try to split by common headings
      const fallbackRegex = /\n(#{1,3}\s*(Task List|Daftar Tugas|Tasks|Development Tasks?))/i;
      const match = fullContent.match(fallbackRegex);
      if (match && match.index !== undefined) {
        prdContent = fullContent.substring(0, match.index).trim();
        taskContent = fullContent.substring(match.index).trim();
      } else {
        // If absolutely no tasks found, just put everything in PRD and set dummy task
        prdContent = fullContent;
        taskContent = "- [ ] AI gagal memisahkan Task List. Anda bisa membaca Tasks di akhir dokumen PRD.";
      }
    }

    // 8. Return Response
    return NextResponse.json({
      success: true,
      prd: prdContent,
      flowchart: taskContent,
    });

  } catch (error: any) {
    console.error("Error generating PRD with Groq:", error);

    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";

    if (status === 429) {
      userMessage = "Kuota API Groq Anda sedang habis (rate limit).";
    } else if (status === 503 || status === 500) {
      userMessage = "Server AI Groq sedang sibuk. Silakan tunggu beberapa saat dan coba lagi.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: status || 500 }
    );
  }
}
