/**
 * useChat Hook — with intelligent fallback AI.
 * Tries the backend first; if unavailable, uses the local voting knowledge base.
 * Never shows a raw network error to the user.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { sendAiMessage } from '../services/api';
import { getFallbackResponse, setFallbackMode } from '../services/fallbackAI';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  text: `**Jai Hind! I am VotePilot AI** — your personal, verified guide to the Indian electoral process.

I am here to help you with:
- **Voter registration** and eligibility checks
- **Valid ID documents** required at the polling booth
- **EVM instructions** and how to cast your vote
- **Finding your polling station**
- **First-time voter guidance**

To get started — **are you a first-time voter, or have you voted in previous elections?**`,
  timestamp: new Date(),
};

const useChat = ({ sessionId, stage, onAiResponse }) => {
  const [messages, setMessages]   = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const bottomRef = useRef(null);
  const triedBackend = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      // Try the backend if we haven't permanently failed
      if (!isOffline) {
        const data = await sendAiMessage(trimmed, sessionId || 'local', stage);
        triedBackend.current = true;

        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          text: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        if (onAiResponse) onAiResponse(data.response);
      } else {
        throw new Error('offline');
      }
    } catch {
      // Backend unavailable — silently switch to fallback AI
      setIsOffline(true);
      setFallbackMode(true);

      // Small delay to feel natural
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));

      const fallbackText = getFallbackResponse(trimmed);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: fallbackText,
        timestamp: new Date(),
        isFallback: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (onAiResponse) onAiResponse(fallbackText);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, stage, isLoading, isOffline, onAiResponse]);

  const resetChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setInputValue('');
    setError(null);
  }, []);

  return {
    messages, inputValue, setInputValue,
    isLoading, error, isOffline,
    sendMessage, resetChat, bottomRef,
  };
};

export default useChat;
