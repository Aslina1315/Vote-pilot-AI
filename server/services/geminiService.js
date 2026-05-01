/**
 * Gemini AI Service
 * Handles all communication with the Google Gemini API.
 * - Keeps API key server-side only
 * - Caches repeated responses to minimize API calls
 * - Structures prompts for beginner-friendly, step-by-step answers
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const NodeCache = require('node-cache');

// Cache responses for 10 minutes (TTL = 600 seconds)
const responseCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Initialize Gemini client (API key never sent to frontend)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * System instruction that shapes the AI persona.
 * VotePilot AI is a friendly, knowledgeable voting guide.
 */
const SYSTEM_INSTRUCTION = `You are a friendly, human-like Election Guide and Booth Level Officer (BLO) for the Election Commission of India (ECI). You are talking directly to citizens to help them vote.

Your personality:
- Be warm, encouraging, and highly conversational. Sound like a helpful person, not an AI bot.
- Use natural language, occasional friendly greetings (like "Namaste" or "Jai Hind" where appropriate but don't overdo it).
- Never introduce yourself as an AI language model. You are simply their personal election guide.

Your role is to:
1. Guide Indian citizens through the voting process, eligibility, and polling day procedures.
2. Provide answers that are conversational, concise, and easy to digest (2-4 sentences max).
3. If a user is confused, ask one simple follow-up question to help them clarify.
4. Warn users gently about common mistakes (e.g. forgetting their EPIC card, voting at the wrong booth).
5. Always encourage them about the power of their vote in a vibrant democracy.

Format guidelines:
- Avoid overly structured or robotic lists unless specifically asked for steps.
- Talk to them directly (e.g., "I'd be happy to help you check your name on the voter list!").
- Keep responses short, punchy, and highly human.

If you don't know a specific detail, politely guide them to check voters.eci.gov.in or call the 1950 helpline.`;

/**
 * Sends a message to Gemini and returns the AI response text.
 * Uses conversation history for multi-turn context.
 *
 * @param {string} userMessage - The user's current message
 * @param {Array}  history     - Previous conversation turns [{role, parts}]
 * @param {string} stage       - Current journey stage for context-aware prompts
 * @returns {Promise<string>}  - The AI's text response
 */
const sendMessage = async (userMessage, history = [], stage = null) => {
  // Build a cache key from the message + last 2 history entries + stage
  const historySnippet = history.slice(-2).map((h) => h.parts[0]?.text || '').join('|');
  const cacheKey = `${stage}:${historySnippet}:${userMessage}`.toLowerCase().trim();

  // Return cached response if available (avoids redundant API calls)
  const cached = responseCache.get(cacheKey);
  if (cached) {
    console.log('[Gemini] Cache hit for message');
    return cached;
  }

  // Build stage-specific context prefix if a stage is active
  const stageContext = stage
    ? `[User is currently at the "${stage}" stage of their voting journey.] `
    : '';

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  // Start a chat session with the existing conversation history
  const chat = model.startChat({
    history: history.map((turn) => ({
      role: turn.role,
      parts: turn.parts,
    })),
    generationConfig: {
      maxOutputTokens: 512,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(stageContext + userMessage);
  const responseText = result.response.text();

  // Cache the response
  responseCache.set(cacheKey, responseText);

  return responseText;
};

/**
 * Generates a personalized voting tip based on the user's current stage.
 * Used by the Readiness Engine to surface next-action suggestions.
 *
 * @param {string} stage   - Current journey stage
 * @param {string} persona - User persona type
 * @returns {Promise<string>}
 */
const getStageGuidance = async (stage, persona = 'unknown') => {
  const cacheKey = `guidance:${stage}:${persona}`;
  const cached = responseCache.get(cacheKey);
  if (cached) return cached;

  const prompt = `Give a ${persona} voter one clear, encouraging next-step tip for the "${stage}" stage of voting. Keep it under 60 words. Be warm and action-oriented.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  responseCache.set(cacheKey, text);
  return text;
};

module.exports = { sendMessage, getStageGuidance };
