import OpenAI from "openai";
import { NextResponse } from "next/server";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  openai: OpenAI,
  prompt: string,
  maxRetries: number = 1
): Promise<string> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Trying Groq API for Revise PRD (attempt ${attempt + 1})`);
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "Anda adalah Product Manager senior yang sedang merevisi dokumen PRD." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0].message.content || "";
    } catch (e: any) {
      lastError = e;
      const status = e?.status || 0;
      if ((status === 429 || status === 503 || status === 500) && attempt < maxRetries) {
        await delay((attempt + 1) * 3000);
        continue;
      }
      break;
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentPrd, userMessage } = body;

    if (!currentPrd || !userMessage) {
      return NextResponse.json(
        { error: "currentPrd dan userMessage wajib diisi." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey
    });

    const prompt = `Berikut adalah PRD yang sedang aktif:
---
${currentPrd}
---

Pengguna meminta revisi berikut: "${userMessage}"

ATURAN:
- Berikan PRD yang sudah direvisi dalam format Markdown lengkap (bukan hanya bagian yang berubah).
- Setelah selesai menulis PRD, tambahkan pemisah tepat seperti ini:
---TASKS_SEPARATOR---
- Setelah pemisah tersebut, buatlah DAFTAR TUGAS (Task List) yang direvisi (berdasarkan PRD baru) dalam format Markdown (gunakan checkbox "- [ ]").
- Terapkan revisi yang diminta oleh pengguna dengan tepat.`;

    const fullContent = await generateWithRetry(openai, prompt);
    
    // Parse PRD and Tasks
    const separator = "---TASKS_SEPARATOR---";
    let prdContent = fullContent;
    let taskContent = "";

    if (fullContent.includes(separator)) {
      const parts = fullContent.split(separator);
      prdContent = parts[0].trim();
      taskContent = parts[1].trim();
    }

    return NextResponse.json({
      success: true,
      prd: prdContent,
      flowchart: taskContent,
    });
  } catch (error: any) {
    console.error("Error revising PRD with Groq:", error);
    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";

    if (status === 429) {
      userMessage = "Kuota API Groq sedang habis. Silakan tunggu dan coba lagi.";
    } else if (status === 503 || status === 500) {
      userMessage = "Server AI Groq sedang sibuk. Silakan tunggu beberapa saat.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: status || 500 }
    );
  }
}
