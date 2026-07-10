import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah Arsitek Produk Visual dan Spesialis Dokumentasi senior. Tugas Anda adalah memecah ide mentah pengguna menjadi sebuah Struktur Hierarki WBS (Work Breakdown Structure) atau Feature Map yang sangat mendetail.

ATURAN FORMAT OUTPUT:
- Anda HARUS merespon HANYA dengan sebuah blok JSON yang valid, tanpa teks penjelasan apapun di sekitarnya.
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
- Urutkan fitur berdasarkan "phase" (FASE 1, FASE 2, dst).
- JANGAN sertakan markdown backticks (seperti \`\`\`json). Mulai langsung dengan tanda kurung kurawal {.`;

const MODEL_PRIORITY = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
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
        const model = ai.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        return response.response.text();
      } catch (e: any) {
        lastError = e;
        const status = e?.status || 0;
        // Retry on 429 (Rate Limit) or 503 (Service Unavailable)
        if ((status === 429 || status === 503) && attempt < maxRetries) {
          const waitTime = (attempt + 1) * 3000; // wait 3s, 6s for better UX, or 15000 if 429? Let's use 5000ms.
          await delay((attempt + 1) * 5000);
          continue;
        }
        // For other errors (like 404 Model Not Found), break and try next model
        break;
      }
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const fullPrompt = `${SYSTEM_PROMPT}\n\nIde Aplikasi:\n${userPrompt}`;
    const rawContent = await generateWithRetry(ai, fullPrompt);

    // Clean up potential markdown formatting
    let cleanContent = rawContent.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.slice(7);
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.slice(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.slice(0, -3);
    }
    cleanContent = cleanContent.trim();

    try {
      const parsedData = JSON.parse(cleanContent);
      return NextResponse.json({
        success: true,
        structure: parsedData,
      });
    } catch (e) {
      console.error("Failed to parse JSON structure:", cleanContent);
      return NextResponse.json({ error: "AI failed to generate a valid JSON structure." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error generating Structure:", error);
    const status = error?.status || 0;
    let userMessage = error?.message || "An unexpected error occurred.";
    if (status === 429) {
      userMessage = "Kuota API Gemini Anda sedang habis. Silakan tunggu 1-2 menit.";
    }
    return NextResponse.json(
      { error: userMessage },
      { status: status === 429 ? 429 : 500 }
    );
  }
}
