/**
 * Home Page — Constitutional India civic design.
 * Premium hero + feature matrix + trust pillars.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import useJourney from '../hooks/useJourney';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] },
});

const FEATURES = [
  {
    to: '/assistant',
    icon: '⚖️',
    title: 'Ask AI Helper',
    desc: 'Context-aware guidance on eligibility, registration, and ballot-casting — powered by Google Gemini.',
    accent: 'rgba(249,115,22,0.15)',
    border: 'rgba(249,115,22,0.25)',
    delay: 0.1,
  },
  {
    to: '/journey',
    icon: '🗺️',
    title: 'My Voting Steps',
    desc: 'Your personalised 4-step roadmap from eligibility verification to casting your ballot.',
    accent: 'rgba(29,109,232,0.12)',
    border: 'rgba(29,109,232,0.25)',
    delay: 0.15,
  },
  {
    to: '/simulation',
    icon: '🏛️',
    title: 'Practice Voting',
    desc: 'Walk through election day step-by-step with illustrated scenes and EVM interaction.',
    accent: 'rgba(217,119,6,0.12)',
    border: 'rgba(217,119,6,0.25)',
    delay: 0.2,
  },
  {
    to: '/dashboard',
    icon: '📊',
    title: 'App Stats',
    desc: 'Real analytics on how VotePilot AI is preparing citizens across India for elections.',
    accent: 'rgba(22,163,74,0.1)',
    border: 'rgba(22,163,74,0.25)',
    delay: 0.25,
  },
];

const TRUST_ITEMS = [
  { icon: '🏛️', label: 'ECI Aligned', sub: 'Election Commission of India guidelines' },
  { icon: '🔒', label: 'Nonpartisan', sub: 'All-party neutral, verified guidance' },
  { icon: '♿', label: 'WCAG 2.1 Accessible', sub: 'ARIA + keyboard + screen-reader ready' },
  { icon: '🤖', label: 'Gemini AI Powered', sub: 'Google\'s most capable AI model' },
];

const Home = () => {
  const { currentUser } = useAuth();
  const { language: _lang } = useLanguage(); // available for future i18n
  const { readinessScore, currentStage } = useJourney();
  const firstName = currentUser?.displayName?.split(' ')[0] || 'Voter';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 px-1">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #0A1C38 0%, #132E5C 55%, #010812 100%)',
          border: '1px solid rgba(29,109,232,0.2)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        aria-label="VotePilot AI hero section"
      >
        {/* Decorative chakra rings */}
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full border border-saffron-500/10 chakra-bg" style={{ animationDuration: '40s' }} aria-hidden="true" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full border border-chakra-500/10 chakra-bg" style={{ animationDuration: '25s', animationDirection: 'reverse' }} aria-hidden="true" />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/3 w-96 h-32 rounded-full bg-saffron-500/5 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 px-8 py-12 lg:px-14 lg:py-16">
          {/* ECI trust strip */}
          <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <span className="text-sm">🇮🇳</span>
            <span className="text-parchment-300 text-xs font-semibold tracking-wide">
              Verified · Election Commission of India · Powered by Google Gemini AI
            </span>
            <span className="w-2 h-2 rounded-full bg-verdant-400 animate-pulse ml-1" aria-hidden="true" />
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.15)}
            className="text-4xl lg:text-5xl xl:text-6xl font-display font-extrabold leading-tight text-white mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Your Constitutional Right,<br />
            <span style={{ background: 'linear-gradient(135deg, #F97316 0%, #FCD34D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Exercised with Confidence.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-parchment-300 text-lg max-w-2xl mb-8 leading-relaxed" style={{ fontWeight: 400 }}>
            VotePilot AI is India's most comprehensive AI-powered election guide — from voter registration
            and document verification to polling booth simulation and readiness assessment.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.25)} className="flex flex-wrap gap-4 mb-8">
            <Link to="/assistant" id="cta-assistant" className="btn-primary text-base px-8 py-4">
              ⚖️ Ask AI Helper
            </Link>
            <Link to="/simulation" id="cta-simulation" className="btn-secondary text-base px-8 py-4">
              🏛️ Practice Voting
            </Link>
          </motion.div>

          {/* Tricolor divider */}
          <div className="tricolor-bar w-32" aria-hidden="true" />
        </div>
      </motion.section>

      {/* ── Returning user readiness strip ─────────────────────────── */}
      {readinessScore > 0 && (
        <motion.div {...fadeUp(0.1)}
          className="vp-card vp-card-saffron p-5 flex items-center gap-4"
          role="status" aria-label="Your voting readiness status"
        >
          <div className="text-3xl" aria-hidden="true">📊</div>
          <div className="flex-1">
            <p className="text-white font-bold text-base">
              Welcome back, {firstName} — you are <span className="text-saffron-400">{readinessScore}% voting-ready.</span>
            </p>
            <p className="text-parchment-400 text-sm mt-0.5">
              Current stage: <span className="text-gold-300 font-semibold capitalize">{currentStage}</span>
            </p>
          </div>
          <Link to="/readiness" className="btn-ghost text-xs" id="home-readiness-link">View Score →</Link>
        </motion.div>
      )}

      {/* ── Feature Matrix ─────────────────────────────────────────── */}
      <section aria-label="Key features">
        <motion.h2 {...fadeUp(0.1)} className="text-2xl font-display font-bold text-white mb-6">
          Your Complete Election Toolkit
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <motion.div key={f.to} {...fadeUp(f.delay)} whileHover={{ y: -3 }}>
              <Link
                to={f.to}
                id={`feature${f.to.replace('/', '-')}`}
                className="vp-card p-6 group block transition-all duration-300"
                style={{
                  '--card-accent': f.accent,
                  '--card-border': f.border,
                  borderColor: f.border,
                }}
                aria-label={f.title}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0" aria-hidden="true"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.3))' }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg mb-1.5 group-hover:text-gold-300 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-parchment-400 text-sm leading-relaxed">{f.desc}</p>
                    <span className="mt-3 inline-block text-saffron-400 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Trust Pillars ─────────────────────────────────────────── */}
      <motion.section {...fadeUp(0.3)} aria-label="Trust and authority credentials">
        <div className="vp-card p-6">
          <h2 className="text-sm font-bold text-parchment-400 uppercase tracking-widest mb-5">
            Why Voters Trust VotePilot AI
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} className="text-center p-3">
                <div className="text-2xl mb-2" aria-hidden="true">{item.icon}</div>
                <p className="text-white font-bold text-sm mb-1">{item.label}</p>
                <p className="text-parchment-400 text-xs leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="tricolor-bar w-full mt-5 opacity-40" aria-hidden="true" />
        </div>
      </motion.section>

    </div>
  );
};

export default Home;
