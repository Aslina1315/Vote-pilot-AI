/** VotePilot AI — Ashoka Seal Logo SVG Component */
import React from 'react';

const Logo = ({ size = 44 }) => {
  const spokes = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 15 * Math.PI) / 180;
    return { x1: 24 + 9 * Math.cos(a), y1: 24 + 9 * Math.sin(a), x2: 24 + 19 * Math.cos(a), y2: 24 + 19 * Math.sin(a) };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="VotePilot AI logo">
      <defs>
        <linearGradient id="lgo-s" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <linearGradient id="lgo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A1C38" />
          <stop offset="100%" stopColor="#132E5C" />
        </linearGradient>
        <radialGradient id="lgo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EA580C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
        </radialGradient>
        <filter id="lgo-shadow">
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#EA580C" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer glow */}
      <circle cx="24" cy="24" r="24" fill="url(#lgo-glow)" />
      {/* Main background circle */}
      <circle cx="24" cy="24" r="22" fill="url(#lgo-bg)" stroke="url(#lgo-s)" strokeWidth="1.5" filter="url(#lgo-shadow)" />
      {/* Ashoka Chakra outer ring */}
      <circle cx="24" cy="24" r="20" fill="none" stroke="url(#lgo-s)" strokeWidth="0.4" strokeOpacity="0.4" />
      {/* 24 Ashoka spokes */}
      {spokes.map((s, i) => (
        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="url(#lgo-s)" strokeWidth="0.7" strokeOpacity="0.65" />
      ))}
      {/* Chakra hub ring */}
      <circle cx="24" cy="24" r="9" fill="url(#lgo-bg)" stroke="url(#lgo-s)" strokeWidth="1" />
      {/* Center dot */}
      <circle cx="24" cy="24" r="2.5" fill="url(#lgo-s)" />
      {/* Ballot rect — top accent */}
      <rect x="18.5" y="5.5" width="11" height="8" rx="1.5" fill="url(#lgo-bg)" stroke="url(#lgo-s)" strokeWidth="0.8" opacity="0.9" />
      <line x1="20.5" y1="8" x2="27.5" y2="8" stroke="#FCD34D" strokeWidth="0.6" strokeOpacity="0.8" />
      <line x1="20.5" y1="10" x2="25.5" y2="10" stroke="#F97316" strokeWidth="0.6" strokeOpacity="0.7" />
      {/* Checkmark inside ballot */}
      <polyline points="21,11.5 22.5,13 26,9.5" stroke="#FCD34D" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
};

export default Logo;
