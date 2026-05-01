/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Ink — Constitutional Deep Navy ─────────────────────────
        ink: {
          950: '#010812',
          900: '#030E20',  // ← main bg
          800: '#061428',
          700: '#0A1C38',
          600: '#0E2548',
          500: '#132E5C',
          400: '#1A3D7A',
          300: '#2554A8',
        },
        // ── Saffron — Indian Civic Energy ──────────────────────────
        saffron: {
          600: '#C2410C',
          500: '#EA580C',  // ← primary CTA
          400: '#F97316',
          300: '#FB923C',
          200: '#FED7AA',
          100: '#FFF7ED',
        },
        // ── Gold — Authority & Premium ──────────────────────────────
        gold: {
          700: '#92400E',
          600: '#B45309',
          500: '#D97706',  // ← headings, borders
          400: '#F59E0B',
          300: '#FCD34D',
          200: '#FEF08A',
        },
        // ── Chakra — Ashoka Blue ────────────────────────────────────
        chakra: {
          700: '#1240A0',
          600: '#1656C8',
          500: '#1D6DE8',
          400: '#3B82F6',
          300: '#7BB3FF',
        },
        // ── Verdant — Election Green ────────────────────────────────
        verdant: {
          600: '#15803D',
          500: '#16A34A',
          400: '#22C55E',
          300: '#4ADE80',
        },
        // ── Parchment — light text ──────────────────────────────────
        parchment: {
          50:  '#FAFBFF',
          100: '#F0F4FF',
          200: '#DCE5F7',
          300: '#B8C8E8',
          400: '#8FA5C8',
          500: '#637AA8',
        },
      },
      fontFamily: {
        // ── Brand / logo — Cinzel (Roman civic authority)
        brand:   ['"Cinzel"', 'Georgia', 'serif'],
        // ── Headings — Playfair Display (authoritative, editorial)
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // ── Body — Manrope (modern, clean, readable)
        sans:    ['"Manrope"', 'system-ui', 'sans-serif'],
        // ── Mono — for code/data
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'hero-gradient':  'linear-gradient(135deg, #0A1C38 0%, #132E5C 50%, #010812 100%)',
        'saffron-glow':   'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)',
        'chakra-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='18' fill='none' stroke='rgba(29,109,232,0.04)' stroke-width='1'/%3E%3Ccircle cx='20' cy='20' r='2' fill='rgba(29,109,232,0.06)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':      'fadeIn 0.45s ease-out',
        'slide-up':     'slideUp 0.45s ease-out',
        'slide-right':  'slideRight 0.35s ease-out',
        'glow-pulse':   'glowPulse 2.5s ease-in-out infinite',
        'float':        'float 3s ease-in-out infinite',
        'chakra-spin':  'chakraSpin 20s linear infinite',
        'dot-bounce':   'dotBounce 1.3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideRight: { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        glowPulse:  { '0%,100%': { boxShadow: '0 0 16px rgba(249,115,22,0.2)' }, '50%': { boxShadow: '0 0 32px rgba(249,115,22,0.45)' } },
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        chakraSpin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        dotBounce:  { '0%,80%,100%': { transform: 'scale(0.6)', opacity: '0.4' }, '40%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:    { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'card':       '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        'saffron':    '0 4px 20px rgba(249,115,22,0.35)',
        'saffron-lg': '0 8px 40px rgba(249,115,22,0.5)',
        'gold':       '0 4px 20px rgba(245,158,11,0.3)',
        'chakra':     '0 4px 20px rgba(29,109,232,0.35)',
        'inner-glow': 'inset 0 0 30px rgba(249,115,22,0.06)',
      },
    },
  },
  plugins: [],
};
