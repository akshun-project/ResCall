 // geminiClient.js
import { GoogleGenAI } from "@google/genai";

// Load API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Create AI client (this exposes ai.models.generateContent)
export const ai = new GoogleGenAI({
  apiKey: apiKey,
});
