/**
 * API Service
 * Centralizes all HTTP calls to the VotePilot AI backend.
 * The Gemini API key is never exposed here — all AI calls go through the backend.
 */

import axios from 'axios';

// Base URL from environment variable (set in .env)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30-second timeout
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach sessionId + Firebase token to every request automatically
apiClient.interceptors.request.use(async (config) => {
  const sessionId = localStorage.getItem('vp_session_id');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }
  // Attach Firebase ID token if user is logged in
  try {
    const { auth } = await import('../config/firebase');
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch { /* skip if firebase not configured */ }
  return config;
});

// ─── Response Interceptor ────────────────────────────────────────────────────
// Normalize error messages for the UI
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ─── AI Endpoints ────────────────────────────────────────────────────────────

/**
 * Send a message to the AI assistant.
 * @param {string} message
 * @param {string} sessionId
 * @param {string|null} stage
 */
export const sendAiMessage = (message, sessionId, stage = null) =>
  apiClient.post('/ai/chat', { message, sessionId, stage });

/**
 * Get a stage-specific voting tip.
 * @param {string} stage
 * @param {string} persona
 */
export const getAiGuidance = (stage, persona) =>
  apiClient.get(`/ai/guidance?stage=${stage}&persona=${persona}`);

/**
 * Clear conversation history for a session.
 * @param {string} sessionId
 */
export const clearAiHistory = (sessionId) =>
  apiClient.delete(`/ai/history/${sessionId}`);

// ─── User Endpoints ──────────────────────────────────────────────────────────

export const getUser = (sessionId) =>
  apiClient.get(`/user/${sessionId}`);

export const upsertUser = (userData) =>
  apiClient.post('/user', userData);

export const updateUserSettings = (sessionId, settings) =>
  apiClient.put(`/user/${sessionId}/settings`, settings);

// ─── Journey Endpoints ───────────────────────────────────────────────────────

export const getJourney = (sessionId) =>
  apiClient.get(`/journey/${sessionId}`);

export const updateJourneyStep = (sessionId, step, completed, notes = '') =>
  apiClient.post(`/journey/${sessionId}/step`, { step, completed, notes });

export const addWarning = (sessionId, message, stage) =>
  apiClient.post(`/journey/${sessionId}/warning`, { message, stage });

export const resetJourney = (sessionId) =>
  apiClient.delete(`/journey/${sessionId}`);

// ─── Health Check ────────────────────────────────────────────────────────────
export const checkHealth = () => apiClient.get('/health');

// ─── Analytics Endpoints ─────────────────────────────────────────────────────
export const getAnalytics   = ()            => apiClient.get('/analytics');
export const recordEvent    = (event, data) => apiClient.post('/analytics/event', { event, ...data });
