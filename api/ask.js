// Vercel Edge Function - Secure Gemini API Proxy
// API key stored securely in environment variables
// Frontend never exposes key to client

export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  // Enable CORS for frontend (must be before method check)
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { question, model, context, conversationHistory } = req.body;

    // Validate inputs
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid request: missing or empty 'question' field" });
    }

    if (!context || typeof context !== "string") {
      return res.status(400).json({ error: "Invalid request: missing 'context' field" });
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable not set");
      return res.status(500).json({
        error: "Server configuration error. Please contact support.",
      });
    }

    // Import GoogleGenerativeAI dynamically
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use provided model or default
    const selectedModel = model || "gemini-2.5-flash";

    // Validate model format
    if (!/^gemini-[\w\.-]+$/.test(selectedModel)) {
      return res.status(400).json({
        error: "Invalid model name. Use format: gemini-X.X-model-type",
      });
    }

    const geminiModel = genAI.getGenerativeModel({ model: selectedModel });

    // Build system prompt for Urbanify context
    const systemPrompt = `Anda adalah AI assistant untuk website Urbanify. Anda membantu menjawab pertanyaan tentang Smart City, IoT, Smart Environment, Urban Greenspace, dan Citizen Engagement.

Panduan:
- Jawab berdasarkan konteks website yang diberikan
- Jika ada sumber/referensi, gunakan format [sumber X] untuk menunjuk ke halaman spesifik
- Gunakan bahasa Indonesia yang jelas dan ramah
- Jika pertanyaan di luar cakupan, katakan "Maaf, saya belum punya informasi tentang itu"
- Jangan membuat informasi yang tidak ada di konteks website`;

    // Format conversation history for API
    const conversationContent = [];

    // Add system context as first message
    conversationContent.push({
      text: `${systemPrompt}\n\nKonteks Website:\n${context}`,
    });

    // Add previous messages if provided
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.question) {
          conversationContent.push({
            text: `User: ${msg.question}`,
          });
        }
        if (msg.answer) {
          conversationContent.push({
            text: `Assistant: ${msg.answer}`,
          });
        }
      }
    }

    // Add current question
    conversationContent.push({
      text: `User: ${question}`,
    });

    // Call Gemini API
    const response = await geminiModel.generateContent(conversationContent);

    // Extract text from response
    if (
      !response.response ||
      !response.response.candidates ||
      response.response.candidates.length === 0
    ) {
      return res.status(500).json({
        error: "No response from API. Please try again.",
      });
    }

    const answer = response.response.candidates[0].content.parts
      .map((part) => part.text)
      .join("");

    // Return successful response
    return res.status(200).json({
      answer: answer.trim(),
      usedModel: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log error for debugging
    console.error("Gemini API Error:", {
      message: error.message,
      status: error.status,
      timestamp: new Date().toISOString(),
    });

    // Check for specific error types
    if (error.message.includes("UNAUTHENTICATED")) {
      return res.status(401).json({
        error:
          "API key invalid or not configured. Please check server settings.",
      });
    }

    if (error.message.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        error: "API quota exhausted. Please try again later.",
      });
    }

    if (error.message.includes("NOT_FOUND")) {
      return res.status(404).json({
        error: "Selected model not found. Please try a different model.",
      });
    }

    // Generic error response
    return res.status(500).json({
      error: "Failed to generate response. Please try again later.",
      debug: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
