/**
 * Header Component
 * Top navigation bar with hamburger menu, page title, and voice indicator.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const PAGE_TITLES = {
  '/':           { title: 'Welcome',         subtitle: 'Your voting journey starts here' },
  '/assistant':  { title: 'AI Assistant',    subtitle: 'Ask me anything about voting' },
  '/journey':    { title: 'My Journey',      subtitle: 'Track your voting progress' },
  '/simulation': { title: 'Voting Simulation', subtitle: 'Practice before election day' },
  '/readiness':  { title: 'Readiness Score', subtitle: 'How prepared are you?' },
  '/settings':   { title: 'Settings',        subtitle: 'Customize your experience' },
};

const Header = () => {
  const { dispatch, user } = useApp();
  const location = useLocation();
  const pageInfo = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 py-4 border-b border-white/10"
      style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(16px)' }}
      role="banner"
    >
      {/* Mobile hamburger */}
      <button
        id="sidebar-toggle"
        onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Toggle navigation menu"
        aria-controls="main-sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <div className="flex-1 ml-4 lg:ml-0">
        <h2 className="text-lg font-display font-bold text-white leading-none">{pageInfo.title}</h2>
        <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">{pageInfo.subtitle}</p>
      </div>

      {/* Right section — user persona badge */}
      <div className="flex items-center gap-3">
        {user.persona !== 'unknown' && (
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-900/60 border border-primary-700/50 text-primary-300 capitalize">
            {user.persona} voter
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-sm font-bold text-white">
          {user.name?.charAt(0).toUpperCase() || 'V'}
        </div>
      </div>
    </header>
  );
};

export default Header;
