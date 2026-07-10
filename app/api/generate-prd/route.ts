import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const SYSTEM_PROMPT = `Anda adalah Product Manager senior. Ubah ide mentah ini menjadi dokumen PRD lengkap berformat Markdown yang berisi:
1) Latar Belakang
2) User Roles
3) Spesifikasi Fitur

ATURAN FORMAT OUTPUT:
- Berikan dokumen PRD dalam format Markdown standar yang rapi.
- Setelah selesai menulis PRD, tambahkan pemisah tepat seperti ini:
---TASKS_SEPARATOR---
- Setelah pemisah tersebut, buatlah DAFTAR TUGAS (Task List) yang sangat detail dalam format Markdown (gunakan checkbox "- [ ]"). 
- Task List ini harus berisi langkah-langkah teknis dan fungsional yang siap dikerjakan oleh developer atau AI Coder untuk mewujudkan PRD tersebut.
- Bagikan task berdasarkan fitur atau halaman (misal: "### Autentikasi", "### Database", dll).`;

const MODEL_PRIORITY = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  ai: GoogleGenerativeAI,
  prompt: string,
  maxRetries: number = 2
): Promise<string> {
  let lastError: any = null;

  for (const modelName of MODEL_PRIORITY) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Trying model: ${modelName} (attempt ${attempt + 1})`);
        const model = ai.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        return response.response.text();
      } catch (e: any) {
        lastError = e;
        const status = e?.status || 0;

        if ((status === 429 || status === 503) && attempt < maxRetries) {
          const waitTime = (attempt + 1) * 5000;
          console.warn(`API error ${status} on ${modelName}, waiting ${waitTime / 1000}s...`);
          await delay(waitTime);
          continue;
        }

        console.warn(`Model ${modelName} failed: ${e.message}`);
        break;
      }
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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    
    let tierInstruction = "";
    if (effectiveTier === 'max') {
      tierInstruction = "INI ADALAH PELANGGAN TINGKAT MAX. Berikan detail teknis terdalam, spesifikasi paling komprehensif, arsitektur sistem lanjutan, dan analisa edge case paling lengkap. Hasilkan PRD terbaik yang pernah ada.";
    } else if (effectiveTier === 'pro') {
      tierInstruction = "INI ADALAH PELANGGAN TINGKAT PRO. Berikan detail yang sangat baik dan terstruktur rapi dengan edge cases yang jelas.";
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n${tierInstruction}\n\nIde Aplikasi:\n${userPrompt}`;
    const fullContent = await generateWithRetry(ai, fullPrompt);

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
    }

    // 8. Return Response
    return NextResponse.json({
      success: true,
      prd: prdContent,
      flowchart: taskContent,
    });

  } catch (error: any) {
    console.error("Error generating PRD:", error);

    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";

    if (status === 429) {
      userMessage = "Kuota API Gemini Anda sedang habis (rate limit). Silakan tunggu 1-2 menit lalu coba lagi.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: status === 429 ? 429 : 500 }
    );
  }
}
