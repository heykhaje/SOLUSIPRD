const { GoogleGenerativeAI } = require("@google/generative-ai");


async function listModels() {
  try {
    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Loaded" : "Missing");
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Actually, getting models requires hitting the REST API directly or using listModels if it exists.
    // In @google/generative-ai, listModels might not be exposed directly in standard initialization.
    // Let's just try to fetch it via REST.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log(data.models.map(m => m.name).join(", "));
  } catch (error) {
    console.error(error);
  }
}
listModels();
