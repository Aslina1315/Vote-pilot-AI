/**
 * Gemini AI Service (Production Optimized)
 * Handles all communication with the Google Gemini API.
 * - Integration: Vertex AI style Grounding with Google Search
 * - Efficiency: Conversation history truncation (max 10 turns)
 * - Reliability: Error masking for production safety
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const NodeCache = require('node-cache');

// Cache for 10 minutes (TTL = 600s)
const responseCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_INSTRUCTION = `You are a friendly, human-like Election Guide and Booth Level Officer (BLO) for the Election Commission of India (ECI).
Your personality: Warm, encouraging, conversational. SOUND LIKE A PERSON, NOT A BOT.
Role:
1. Guide citizens through voting, eligibility, and polling procedures.
2. Provide concise, conversational answers (2-4 sentences).
3. If unsure, guide them to voters.eci.gov.in or 1950.
4. Warn about common mistakes (forgetting ID, wrong booth).
CRITICAL: Use the provided Google Search results to ensure your information about dates, locations, and procedures is 100% factual.`;

/**
 * Sends a message to Gemini and returns the AI response text.
 * @param {string} userMessage 
 * @param {Array} history 
 * @param {string} stage 
 */
const sendMessage = async (userMessage, history = [], stage = null) => {
  // 1. Efficiency: Truncate history to last 10 turns to keep MongoDB docs small
  const MAX_HISTORY = 10;
  const truncatedHistory = history.slice(-MAX_HISTORY);

  const historySnippet = truncatedHistory.slice(-2).map((h) => h.parts[0]?.text || '').join('|');
  const cacheKey = `${stage}:${historySnippet}:${userMessage}`.toLowerCase().trim();

  const cached = responseCache.get(cacheKey);
  if (cached) return cached;

  const stageContext = stage ? `[Stage: ${stage}] ` : '';

  // 2. Google Integration: Enable Grounding with Google Search
  // This ensures the AI doesn't hallucinate election dates or rules.
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
    // Note: tools/google_search_retrieval is available in Gemini 1.5
    tools: [{ googleSearchRetrieval: {} }]
  });

  const chat = model.startChat({
    history: truncatedHistory.map((turn) => ({
      role: turn.role,
      parts: turn.parts,
    })),
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.4, // Lower temperature for higher factual accuracy
    },
  });

  try {
    const result = await chat.sendMessage(stageContext + userMessage);
    const responseText = result.response.text();

    responseCache.set(cacheKey, responseText);
    return responseText;
  } catch (err) {
    console.error('[Gemini Service] API Error:', err.message);
    throw new Error('The Election Guide is currently processing a high volume of requests. Please try again in a moment.');
  }
};

/**
 * Generates a personalized voting tip.
 */
const getStageGuidance = async (stage, persona = 'unknown') => {
  const cacheKey = `guidance:${stage}:${persona}`;
  const cached = responseCache.get(cacheKey);
  if (cached) return cached;

  const prompt = `Give a ${persona} voter one clear, encouraging tip for the "${stage}" stage of voting in India. Max 50 words. Focus on accuracy.`;

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    tools: [{ googleSearchRetrieval: {} }] 
  });
  
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  responseCache.set(cacheKey, text);
  return text;
};

module.exports = { sendMessage, getStageGuidance };

