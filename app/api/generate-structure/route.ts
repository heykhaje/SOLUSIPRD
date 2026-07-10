import OpenAI from "openai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah Arsitek Produk Visual dan Spesialis Dokumentasi senior. Tugas Anda adalah memecah ide mentah pengguna menjadi sebuah Struktur Hierarki WBS (Work Breakdown Structure) atau Feature Map yang sangat mendetail.

ATURAN FORMAT OUTPUT:
- Anda HARUS merespon HANYA dengan sebuah blok JSON yang valid.
- Format JSON harus sama persis seperti ini:
{
  "name": "NAMA PRODUK",
  "description": "Perencanaan",
  "features": [
    {
      "name": "Nama Fitur (Singkat)",
      "phase": "FASE 1",
      "status": "Direncanakan",
      "icon": "lucide-icon-name",
      "subfeatures": [
        { "name": "Sub fitur 1", "icon": "lucide-icon-name" },
        { "name": "Sub fitur 2", "icon": "lucide-icon-name" }
      ]
    }
  ]
}
- Maksimal berikan 4 sampai 6 "features".
- Untuk setiap feature, berikan 3 sampai 5 "subfeatures".
- Untuk field "icon", berikan nama ikon dari pustaka Lucide React dalam format kebab-case (contoh: "shopping-cart", "credit-card", "users", "utensils", "layout-dashboard", "settings", "check-circle", "list", "bell", "shield", "box", "home", "search"). Pilih yang paling relevan.
- Urutkan fitur berdasarkan "phase" (FASE 1, FASE 2, dst).`;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(
  openai: OpenAI,
  prompt: string,
  maxRetries: number = 2
): Promise<string> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Trying Groq API for JSON Structure (attempt ${attempt + 1})`);
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Ide Aplikasi:\n${prompt}` }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });
      return completion.choices[0].message.content || "";
    } catch (e: any) {
      lastError = e;
      const status = e?.status || 0;
      
      if ((status === 429 || status === 503 || status === 500) && attempt < maxRetries) {
        const waitTime = (attempt + 1) * 3000;
        await delay(waitTime);
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
    const { prompt: userPrompt } = body;

    if (!userPrompt || typeof userPrompt !== "string" || !userPrompt.trim()) {
      return NextResponse.json({ error: "userPrompt is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey
    });
    
    const rawContent = await generateWithRetry(openai, userPrompt);

    try {
      const parsedData = JSON.parse(rawContent);
      return NextResponse.json({
        success: true,
        structure: parsedData,
      });
    } catch (e) {
      console.error("Failed to parse JSON structure:", rawContent);
      return NextResponse.json({ error: "AI failed to generate a valid JSON structure." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error generating Structure with Groq:", error);
    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";
    if (status === 429) {
      userMessage = "Kuota API Groq Anda sedang habis. Silakan isi ulang saldo.";
    } else if (status === 503 || status === 500) {
      userMessage = "Server AI Groq sedang sibuk. Silakan tunggu beberapa saat.";
    }
    return NextResponse.json(
      { error: userMessage },
      { status: status || 500 }
    );
  }
}
