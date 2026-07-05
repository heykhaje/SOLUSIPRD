import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah Product Manager senior. Ubah ide mentah ini menjadi dokumen PRD lengkap berformat Markdown yang berisi: 
1) Latar Belakang
2) User Roles
3) Spesifikasi Fitur
4) User Flow
- Jelaskan alur utama pengguna dari awal hingga akhir
- Buat step-by-step flow untuk setiap user role
- Sertakan edge cases dan error handling yang perlu dipertimbangkan

ATURAN FORMAT OUTPUT:
- Berikan dokumen PRD dalam format Markdown standar yang rapi.
- JANGAN sertakan flowchart atau diagram Mermaid di dalam dokumen PRD.
- Setelah selesai menulis PRD, tambahkan pemisah tepat seperti ini:
---FLOWCHART_SEPARATOR---
- Setelah pemisah tersebut, tulis HANYA kode Mermaid flowchart (tanpa markdown codeblock, tanpa backtick) yang merepresentasikan User Flow utama dari PRD di atas.
- Flowchart harus menggunakan syntax Mermaid.js yang valid (graph TD atau flowchart TD).`;

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-flash-latest",
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

        // If 429 (rate limit), wait and retry same model
        if (status === 429 && attempt < maxRetries) {
          const waitTime = (attempt + 1) * 15000; // 15s, 30s
          console.warn(`Rate limited on ${modelName}, waiting ${waitTime / 1000}s...`);
          await delay(waitTime);
          continue;
        }

        // For other errors or max retries reached, try next model
        console.warn(`Model ${modelName} failed: ${e.message}`);
        break;
      }
    }
  }

  throw lastError;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt: userPrompt, tier } = body;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return NextResponse.json(
        { error: "userPrompt is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Please add it to your environment." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenerativeAI(apiKey);
    
    // Add extra instructions based on tier
    let tierInstruction = "";
    if (tier === 'max') {
      tierInstruction = "INI ADALAH PELANGGAN TINGKAT MAX. Berikan detail teknis terdalam, spesifikasi paling komprehensif, arsitektur sistem lanjutan, dan analisa edge case paling lengkap. Hasilkan PRD terbaik yang pernah ada.";
    } else if (tier === 'pro') {
      tierInstruction = "INI ADALAH PELANGGAN TINGKAT PRO. Berikan detail yang sangat baik dan terstruktur rapi dengan edge cases yang jelas.";
    }

    const fullPrompt = `${SYSTEM_PROMPT}\n${tierInstruction}\n\nIde Aplikasi:\n${userPrompt}`;
    const fullContent = await generateWithRetry(ai, fullPrompt);

    if (!fullContent) {
      return NextResponse.json(
        { error: "AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    // Parse PRD and Flowchart from the response
    const separator = "---FLOWCHART_SEPARATOR---";
    let prdContent = fullContent;
    let flowchartContent = "";

    if (fullContent.includes(separator)) {
      const parts = fullContent.split(separator);
      prdContent = parts[0].trim();
      flowchartContent = parts[1]
        .trim()
        .replace(/^```mermaid\s*/i, "")
        .replace(/```\s*$/, "")
        .trim();
    }

    return NextResponse.json({
      success: true,
      prd: prdContent,
      flowchart: flowchartContent,
    });
  } catch (error: any) {
    console.error("Error generating PRD:", error);

    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";

    if (status === 429) {
      userMessage =
        "Kuota API Gemini Anda sedang habis (rate limit). Silakan tunggu 1-2 menit lalu coba lagi.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: status === 429 ? 429 : 500 }
    );
  }
}
