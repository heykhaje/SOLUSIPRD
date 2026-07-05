import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  ai: GoogleGenerativeAI,
  prompt: string,
  maxRetries: number = 1
): Promise<string> {
  let lastError: any = null;

  for (const modelName of MODEL_PRIORITY) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = ai.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        return response.response.text();
      } catch (e: any) {
        lastError = e;
        if (e?.status === 429 && attempt < maxRetries) {
          await delay((attempt + 1) * 10000);
          continue;
        }
        break;
      }
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenerativeAI(apiKey);

    const prompt = `Anda adalah Product Manager senior yang sedang merevisi dokumen PRD.

Berikut adalah PRD yang sedang aktif:
---
${currentPrd}
---

Pengguna meminta revisi berikut: "${userMessage}"

ATURAN:
- Berikan PRD yang sudah direvisi dalam format Markdown lengkap (bukan hanya bagian yang berubah).
- Jangan sertakan flowchart atau diagram Mermaid.
- Pertahankan format dan struktur PRD yang sama.
- Terapkan revisi yang diminta oleh pengguna dengan tepat.
- Berikan respon murni Markdown PRD saja, tanpa penjelasan tambahan di luar dokumen.`;

    const revisedPrd = await generateWithRetry(ai, prompt);

    return NextResponse.json({
      success: true,
      prd: revisedPrd,
    });
  } catch (error: any) {
    console.error("Error revising PRD:", error);
    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";

    if (status === 429) {
      userMessage = "Kuota API sedang habis. Silakan tunggu 1-2 menit lalu coba lagi.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: status === 429 ? 429 : 500 }
    );
  }
}
