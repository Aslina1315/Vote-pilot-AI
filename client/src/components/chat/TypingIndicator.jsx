/**
 * TypingIndicator Component
 * Shows an animated "AI is thinking" indicator while loading.
 */

import React from 'react';

const TypingIndicator = () => (
  <div
    className="flex gap-3 animate-fade-in"
    role="status"
    aria-label="VotePilot AI is typing"
    aria-live="polite"
  >
    {/* AI avatar */}
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center text-sm" aria-hidden="true">
      🤖
    </div>
    {/* Dot animation */}
    <div className="bubble-ai flex items-center px-4 py-3">
      <div className="dot-loader" aria-hidden="true">
        <span /><span /><span />
      </div>
    </div>
  </div>
);

export default TypingIndicator;
