/**
 * ChatMessage — Premium civic bubble design with markdown formatting.
 */

import React from 'react';
import { motion } from 'framer-motion';

// Minimal markdown → formatted text renderer
const parseMarkdown = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Headers ## or ###
    if (line.startsWith('### ')) return <h4 key={i} style={{ color: '#FCD34D', fontWeight: 700, marginTop: i > 0 ? 8 : 0, marginBottom: 4, fontSize: '13px' }}>{line.slice(4)}</h4>;
    if (line.startsWith('## '))  return <h3 key={i} style={{ color: '#FCD34D', fontWeight: 700, marginTop: i > 0 ? 10 : 0, marginBottom: 4, fontSize: '14px' }}>{line.slice(3)}</h3>;

    // Blank line = spacer
    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;

    // Bullet/numbered list
    const isBullet  = line.startsWith('- ') || line.startsWith('• ');
    const isNumber  = /^\d+\./.test(line);

    const renderInline = (txt) => {
      const parts = txt.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={j} style={{ color: '#FCD34D', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={j} style={{ color: '#FB923C', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
        return part;
      });
    };

    if (isBullet) {
      return (
        <div key={i} className="flex gap-2" style={{ marginBottom: 4 }}>
          <span style={{ color: '#F97316', flexShrink: 0, marginTop: 1 }}>▸</span>
          <span>{renderInline(line.replace(/^[•-]\s/, ''))}</span>
        </div>
      );
    }
    if (isNumber) {
      const num = line.match(/^(\d+)\.\s*/)?.[1];
      const content = line.replace(/^\d+\.\s*/, '');
      return (
        <div key={i} className="flex gap-2.5" style={{ marginBottom: 4 }}>
          <span style={{ color: '#F97316', fontWeight: 700, flexShrink: 0, minWidth: 18 }}>{num}.</span>
          <span>{renderInline(content)}</span>
        </div>
      );
    }

    return <p key={i} style={{ marginBottom: 4, lineHeight: 1.65 }}>{renderInline(line)}</p>;
  });
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const time   = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end gap-2.5"
      >
        <div>
          <div className="bubble-user">{message.text}</div>
          <p className="text-right mt-1" style={{ fontSize: '10px', color: '#637AA8' }}>{time}</p>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}
          aria-hidden="true"
        >
          👤
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-2.5"
    >
      {/* AI Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, #0E2548, #132E5C)',
          border: '1px solid rgba(29,109,232,0.3)',
          boxShadow: '0 2px 12px rgba(29,109,232,0.2)',
        }}
        aria-label="VotePilot AI"
      >
        ⚖️
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontFamily: '"Cinzel", serif', fontSize: '10px', fontWeight: 600, color: '#F97316', letterSpacing: '0.1em' }}>
            VOTEPILOT AI
          </span>
          {message.isFallback && (
            <span style={{ fontSize: '9px', color: '#637AA8', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
              Knowledge Base
            </span>
          )}
        </div>
        <div className="bubble-ai" role="status" aria-live="polite">
          {parseMarkdown(message.text)}
        </div>

        <p className="mt-1" style={{ fontSize: '10px', color: '#637AA8' }}>{time}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
