/**
 * Assistant Page — Constitutional AI chat with fallback knowledge base.
 * Never shows a network error — silently uses offline knowledge when backend unavailable.
 */

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp }      from '../context/AppContext';
import { useAuth }     from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import useChat         from '../hooks/useChat';
import useVoice        from '../hooks/useVoice';
import ChatMessage     from '../components/chat/ChatMessage';
import ChatInput       from '../components/chat/ChatInput';
import useJourney      from '../hooks/useJourney';

const QUICK_PROMPTS = [
  { label: 'Am I eligible to vote?',            icon: '✅' },
  { label: 'What documents do I need?',         icon: '🪪' },
  { label: 'How to register as a voter?',       icon: '📝' },
  { label: 'How does the EVM work?',            icon: '🗳️' },
  { label: 'Find my polling station',           icon: '📍' },
  { label: 'Guide me as a first-time voter',    icon: '🆕' },
];

// Word-by-word streaming renderer
const StreamingText = ({ text, onDone }) => {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    idx.current = 0;
    setDisplayed('');
    const words = text.split(' ');
    const timer = setInterval(() => {
      if (idx.current >= words.length) { clearInterval(timer); onDone?.(); return; }
      setDisplayed((p) => p + (idx.current === 0 ? '' : ' ') + words[idx.current]);
      idx.current++;
    }, 22);
    return () => clearInterval(timer);
  }, [text]); // eslint-disable-line

  return <span>{displayed}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ color: '#F97316' }}>▌</motion.span></span>;
};

// Typing indicator (AI thinking)
const ThinkingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 6 }}
    className="flex gap-2.5"
  >
    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #0E2548, #132E5C)', border: '1px solid rgba(29,109,232,0.3)' }}>
      ⚖️
    </div>
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-bl-sm"
      style={{ background: 'rgba(14,37,72,0.8)', border: '1px solid rgba(29,109,232,0.2)' }}
      role="status" aria-label="AI is composing a response">
      <div className="dot-loader">
        <span /><span /><span />
      </div>
      <span style={{ fontSize: '12px', color: '#637AA8', fontFamily: '"Manrope"' }}>
        Composing response…
      </span>
    </div>
  </motion.div>
);

const Assistant = () => {
  const { sessionId, user } = useApp();
  const { currentUser }     = useAuth();
  const { language }        = useLanguage();
  const { currentStage }    = useJourney();
  const [streaming, setStreaming]   = useState(false);
  const [lastAiIdx, setLastAiIdx]   = useState(-1);

  const handleAiResponse = useCallback((text) => {
    setStreaming(true);
    if (user.settings?.voiceEnabled) {
      const clean = text.replace(/\*\*/g, '').replace(/\n/g, ' ');
      speak(clean.substring(0, 280));
    }
  }, [user.settings?.voiceEnabled]); // eslint-disable-line

  const {
    messages, inputValue, setInputValue,
    isLoading, isOffline,
    sendMessage, resetChat, bottomRef,
  } = useChat({
    sessionId: currentUser?.uid || sessionId,
    stage: currentStage,
    onAiResponse: handleAiResponse,
  });

  useEffect(() => {
    const n = messages.filter((m) => m.role === 'ai').length;
    setLastAiIdx(n - 1);
  }, [messages]);

  const handleTranscript = useCallback((text) => setInputValue(text), [setInputValue]);

  const { isListening, isSpeaking, isSupported, startListening, stopListening, speak, stopSpeaking } = useVoice({
    onTranscript: handleTranscript,
    language: language === 'ta' ? 'ta-IN' : 'en-IN',
  });

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 110px)' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: 'linear-gradient(135deg, #0E2548 0%, #132E5C 100%)',
              border: '1px solid rgba(29,109,232,0.35)',
              boxShadow: '0 4px 20px rgba(29,109,232,0.25)',
            }}>
            ⚖️
          </div>
          <div>
            <p style={{ fontFamily: '"Cinzel", serif', fontSize: '13px', fontWeight: 700, color: '#F97316', letterSpacing: '0.12em' }}>
              VOTEPILOT AI
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-verdant-400 animate-pulse" />
              <p style={{ fontSize: '11px', color: '#637AA8', fontFamily: '"Manrope"' }}>
                {isOffline ? 'Knowledge Base Mode' : 'Live AI Mode'} · Stage:{' '}
                <span style={{ color: '#FCD34D', textTransform: 'capitalize' }}>{currentStage}</span>
                {isSpeaking && <span style={{ color: '#F97316', marginLeft: 8 }}>🔊 Speaking…</span>}
                {isListening && <span style={{ color: '#FB923C', marginLeft: 8 }}>🎤 Listening…</span>}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="btn-ghost text-xs py-1.5 px-3">🔇 Stop</button>
          )}
          <button onClick={resetChat} className="btn-ghost text-xs py-1.5 px-3" aria-label="Clear chat history">
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* ── Offline notice (non-intrusive) ──────────────── */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="mb-3 px-4 py-2.5 rounded-xl flex items-center gap-3 flex-shrink-0"
          style={{ background: 'rgba(19,46,92,0.5)', border: '1px solid rgba(29,109,232,0.2)', fontSize: '12px' }}
          role="note"
        >
          <span>📚</span>
          <span style={{ color: '#8FA5C8' }}>
            Running on built-in knowledge base. All answers are based on official ECI guidelines.{' '}
            <button onClick={() => window.location.reload()} style={{ color: '#F97316', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Retry live AI →
            </button>
          </span>
        </motion.div>
      )}

      {/* ── Quick Prompts ────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-3 flex-shrink-0" role="group" aria-label="Suggested questions">
        {QUICK_PROMPTS.slice(0, 4).map((p) => (
          <motion.button
            key={p.label}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => sendMessage(p.label)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all disabled:opacity-40"
            style={{
              background: 'rgba(14,37,72,0.7)',
              border: '1px solid rgba(29,109,232,0.2)',
              color: '#8FA5C8',
              fontFamily: '"Manrope"',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.color = '#FB923C'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(29,109,232,0.2)'; e.currentTarget.style.color = '#8FA5C8'; }}
          >
            <span>{p.icon}</span>
            {p.label}
          </motion.button>
        ))}
      </div>

      {/* ── Chat Window ──────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, rgba(6,20,40,0.9) 0%, rgba(3,14,32,0.95) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.4)',
        }}
        role="log" aria-label="Conversation with VotePilot AI" aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const aiIdx = messages.slice(0, i + 1).filter((m) => m.role === 'ai').length - 1;
            const isLatestAi = msg.role === 'ai' && aiIdx === lastAiIdx && streaming;

            if (isLatestAi) {
              return (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #0E2548, #132E5C)', border: '1px solid rgba(29,109,232,0.3)' }}>
                      ⚖️
                    </div>
                    <div className="flex-1">
                      <p style={{ fontFamily: '"Cinzel", serif', fontSize: '10px', fontWeight: 600, color: '#F97316', letterSpacing: '0.1em', marginBottom: 4 }}>VOTEPILOT AI</p>
                      <div className="bubble-ai" style={{ fontSize: '14px', color: '#DCE5F7', lineHeight: 1.7 }}>
                        <StreamingText text={msg.text} onDone={() => setStreaming(false)} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <ChatMessage message={msg} />
              </motion.div>
            );
          })}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && <ThinkingIndicator />}
        </AnimatePresence>

        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* ── Input Bar ───────────────────────────────────── */}
      <div className="mt-3 flex-shrink-0">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => sendMessage(inputValue)}
          onVoiceStart={startListening}
          onVoiceStop={stopListening}
          isLoading={isLoading}
          isListening={isListening}
          isVoiceSupported={isSupported}
          placeholder="Ask any question about voting, registration, or elections…"
        />
      </div>

      {/* ── Footer trust ────────────────────────────────── */}
      <p className="text-center mt-2 flex-shrink-0" style={{ fontSize: '10px', color: '#3A4A6A' }}>
        🗳️ Verified ECI Guidelines · 🔒 Nonpartisan · 🤖 Powered by Google Gemini AI
      </p>
    </div>
  );
};

export default Assistant;
