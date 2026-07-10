import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah Product Manager senior. Tugas Anda adalah memecah ide mentah pengguna menjadi sebuah Struktur Mind Map hierarkis (Perencanaan -> Fitur -> Sub Fitur).

ATURAN FORMAT OUTPUT:
- Anda HARUS merespon HANYA dengan sebuah blok JSON yang valid, tanpa teks penjelasan apapun di sekitarnya.
- Format JSON harus sama persis seperti ini:
{
  "name": "NAMA PROYEK (SINGKAT)",
  "features": [
    {
      "name": "NAMA FITUR (SINGKAT, MAKSIMAL 3-4 KATA)",
      "subfeatures": [
        "Sub fitur 1",
        "Sub fitur 2",
        "Sub fitur 3"
      ]
    }
  ]
}
- Maksimal berikan 3 sampai 5 "features" (kotak tengah).
- Untuk setiap feature, berikan 2 sampai 4 "subfeatures" (garis di kotak ujung).
- JANGAN sertakan markdown backticks (seperti \`\`\`json). Mulai langsung dengan tanda kurung kurawal {.`;

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
        const model = ai.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        return response.response.text();
      } catch (e: any) {
        lastError = e;
        const status = e?.status || 0;
        if (status === 429 && attempt < maxRetries) {
          const waitTime = (attempt + 1) * 15000;
          await delay(waitTime);
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
