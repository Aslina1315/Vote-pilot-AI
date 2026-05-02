/**
 * Header Component
 * Top navigation bar with hamburger menu, page title, and voice indicator.
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/':           { title: 'Welcome',         subtitle: 'Your voting journey starts here' },
  '/assistant':  { title: 'AI Assistant',    subtitle: 'Ask me anything about voting' },
  '/journey':    { title: 'My Journey',      subtitle: 'Track your voting progress' },
  '/simulation': { title: 'Voting Simulation', subtitle: 'Practice before election day' },
  '/readiness':  { title: 'Readiness Score', subtitle: 'How prepared are you?' },
  '/settings':   { title: 'Settings',        subtitle: 'Customize your experience' },
};

const IN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

const PERSONAS = [
  { value: 'unknown',    label: '— Select voter type —' },
  { value: 'first-time', label: '🆕 First-time voter' },
  { value: 'returning',  label: '🔄 Returning voter' },
  { value: 'student',    label: '🎓 Student voter' },
  { value: 'senior',     label: '👴 Senior voter' },
];

const Header = () => {
  const { dispatch, user, updateUser } = useApp();
  const { currentUser } = useAuth();
  const location = useLocation();
  const pageInfo = PAGE_TITLES[location.pathname] || PAGE_TITLES['/'];

  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState(user.name || currentUser?.displayName || '');
  const [state, setState] = useState(user.state || '');
  const [age, setAge] = useState(user.age || '');
  const [persona, setPersona] = useState(user.persona || 'unknown');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateUser({ name, state, age: parseInt(age) || null, persona });
    setSaving(false);
    setShowProfile(false);
  };

  return (
    <>
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

        {/* Right section — user persona badge & Profile */}
        <div className="flex items-center gap-3">
          {user.persona !== 'unknown' && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-900/60 border border-primary-700/50 text-primary-300 capitalize">
              {user.persona} voter
            </span>
          )}
          <button 
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-saffron-600 hover:bg-saffron-500 transition-colors flex items-center justify-center text-sm font-bold text-white shadow-lg border-2 border-white/10"
            aria-label="Edit Profile"
          >
            {user.name?.charAt(0).toUpperCase() || currentUser?.displayName?.charAt(0).toUpperCase() || 'V'}
          </button>
        </div>
      </header>

      {/* Sleek Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-ink-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-ink-900 to-ink-800">
                <h2 className="text-xl font-display font-bold text-white">Edit Profile</h2>
                <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-white p-1">
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Display Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field w-full bg-ink-950 border border-white/10 rounded-lg p-2 text-white" placeholder="Your name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">State / UT</label>
                      <select value={state} onChange={(e) => setState(e.target.value)} className="input-field w-full bg-ink-950 border border-white/10 rounded-lg p-2 text-white">
                        <option value="">— Select —</option>
                        {IN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Age</label>
                      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="input-field w-full bg-ink-950 border border-white/10 rounded-lg p-2 text-white" placeholder="18+" min={18} max={120} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Voter Type</label>
                    <select value={persona} onChange={(e) => setPersona(e.target.value)} className="input-field w-full bg-ink-950 border border-white/10 rounded-lg p-2 text-white">
                      {PERSONAS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setShowProfile(false)} className="btn-ghost flex-1">Cancel</button>
                    <button type="submit" disabled={saving} className="btn-primary flex-1">
                      {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
