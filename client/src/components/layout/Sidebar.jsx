/**
 * Sidebar — Constitutional India civic navigation.
 * Uses Ashoka logo, 22 languages support, and routing for Polling Navigator.
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import useJourney from '../../hooks/useJourney';
import Logo from '../ui/Logo';

const NAV = [
  { to: '/',            icon: '🏠', label: 'Home',              end: true },
  { to: '/assistant',   icon: '⚖️', label: 'Ask AI Helper' },
  { to: '/journey',     icon: '🗺️', label: 'My Voting Steps' },
  { to: '/navigator',   icon: '📍', label: 'Find My Booth' },
  { to: '/simulation',  icon: '🏛️', label: 'Practice Voting' },
  { to: '/readiness',   icon: '📊', label: 'My Progress' },
  { to: '/dashboard',   icon: '📈', label: 'App Stats' },
  { to: '/settings',    icon: '⚙️', label: 'Settings' },
];

const Sidebar = () => {
  const { sidebarOpen, dispatch }    = useApp();
  const { currentUser, logout }      = useAuth();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { readinessScore }           = useJourney();
  const location                     = useLocation();
  const closeSidebar = () => dispatch({ type: 'CLOSE_SIDEBAR' });

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-950 z-30 lg:hidden"
            onClick={closeSidebar} aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        id="main-sidebar"
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 h-full w-[260px] z-40 flex flex-col
          transition-transform duration-300 ease-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(180deg, #040E24 0%, #061428 60%, #030E20 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Brand Header ────────────────────────────── */}
        <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-3">
            <Logo size={42} />
            <div>
              <h1 className="text-white leading-none" style={{ fontFamily: '"Cinzel", Georgia, serif', fontSize: '15px', fontWeight: 700, letterSpacing: '0.12em' }}>
                VOTEPILOT
              </h1>
              <p className="text-saffron-400" style={{ fontFamily: '"Manrope", sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '2px' }}>
                AI Election Guide
              </p>
            </div>
          </div>
          {/* Trust badges */}
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-parchment-400 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '10px' }}>
              🔒 Verified
            </span>
            <span className="text-xs text-parchment-400 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '10px' }}>
              🇮🇳 ECI Aligned
            </span>
          </div>
        </div>

        {/* ── User Profile ─────────────────────────────── */}
        {currentUser && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3 mb-2.5">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" style={{ border: '2px solid rgba(249,115,22,0.4)' }} />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)', fontSize: '13px' }}>
                  {(currentUser.displayName || currentUser.email || 'V').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate" style={{ fontSize: '13px' }}>
                  {currentUser.displayName || 'Voter'}
                </p>
                {currentUser.email && (
                  <p className="text-parchment-500 truncate" style={{ fontSize: '10px' }}>{currentUser.email}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between mb-1.5" style={{ fontSize: '10px' }}>
              <span className="text-parchment-400 font-semibold uppercase tracking-wider">Readiness</span>
              <span className="text-saffron-400 font-bold">{readinessScore}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                className="readiness-bar h-full"
                initial={{ width: 0 }}
                animate={{ width: `${readinessScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────── */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5" aria-label="App sections">
          {NAV.map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeSidebar}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon text-base flex-shrink-0">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── Language Select ───────────────────────────── */}
        <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <label htmlFor="language-select" className="text-parchment-500 block mb-2" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Language
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-ink-800 text-parchment-200 border border-white/10 rounded-lg px-2 py-2 text-xs outline-none focus:border-saffron-500"
            style={{ fontFamily: '"Manrope", sans-serif' }}
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Logout ───────────────────────────────────── */}
        <div className="px-4 pb-4">
          <button onClick={logout} className="w-full btn-ghost text-xs py-2.5" style={{ color: '#8B9CC8' }}>
            🚪 Sign Out
          </button>
          <p className="text-center text-parchment-500 mt-2" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>
            Powered by Google Gemini AI
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
