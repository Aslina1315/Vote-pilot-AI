/**
 * ChatInput Component
 * Text input bar with voice button and send button.
 * Handles keyboard shortcuts (Enter to send, Shift+Enter for newline).
 */

import React, { useRef, useEffect } from 'react';

const ChatInput = ({
  value,
  onChange,
  onSend,
  onVoiceStart,
  onVoiceStop,
  isLoading,
  isListening,
  isVoiceSupported,
  placeholder = 'Ask me anything about voting…',
}) => {
  const inputRef = useRef(null);

  // Focus input on mount for better UX
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleKeyDown = (e) => {
    // Enter without Shift = send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div
      className="flex items-end gap-3 p-4 border-t border-white/10"
      style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)' }}
      role="group"
      aria-label="Message input area"
    >
      {/* Voice button */}
      {isVoiceSupported && (
        <button
          id="voice-btn"
          onClick={isListening ? onVoiceStop : onVoiceStart}
          className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200
            ${isListening
              ? 'bg-red-500/20 border border-red-500 text-red-400 animate-pulse-soft'
              : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary-500/50'
            }`}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          aria-pressed={isListening}
          title={isListening ? 'Click to stop recording' : 'Click to speak'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {isListening ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10h6" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
            )}
          </svg>
        </button>
      )}

      {/* Text input */}
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          id="chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="input-field resize-none overflow-hidden pr-4"
          aria-label="Type your message"
          aria-multiline="true"
          disabled={isLoading}
          style={{ minHeight: '44px', maxHeight: '120px' }}
          onInput={(e) => {
            // Auto-grow textarea
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
        />
      </div>

      {/* Send button */}
      <button
        id="send-btn"
        onClick={onSend}
        disabled={isLoading || !value.trim()}
        className="btn-primary flex-shrink-0 w-11 h-11 p-0 rounded-xl"
        aria-label="Send message"
        title="Send (Enter)"
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput;
