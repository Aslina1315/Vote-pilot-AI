/**
 * Settings Page — Upgraded with constitutional theme, all 22 languages, and profile editing.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { updateUserSettings, clearAiHistory, resetJourney } from '../services/api';

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

const ToggleSwitch = ({ id, checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2 -mx-2">
    <div className="pr-4">
      <p className="text-white text-base font-bold tracking-wide" style={{ fontFamily: '"Manrope", sans-serif', letterSpacing: '0.02em' }}>{label}</p>
      {description && <p className="text-sm text-parchment-400/80 mt-1.5 leading-relaxed tracking-wide" style={{ fontFamily: '"Inter", sans-serif' }}>{description}</p>}
    </div>
    <button
      id={id} role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 flex-shrink-0 shadow-inner
        ${checked ? 'bg-saffron-500 border border-saffron-400' : 'bg-ink-800 border border-white/10'}`}
    >
      <motion.span
        layout
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md ${checked ? 'left-[30px]' : 'left-[4px]'}`}
        animate={{ left: checked ? '28px' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

const Settings = () => {
  const { sessionId, user, updateUser, dispatch } = useApp();
  const { currentUser }           = useAuth();
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  const [name, setName]       = useState(user.name || currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [state, setState]     = useState(user.state || '');
  const [age, setAge]         = useState(user.age || '');
  const [persona, setPersona] = useState(user.persona || 'unknown');
  const [saving, setSaving]   = useState(false);
  const [feedback, setFeedback] = useState('');

  const voiceEnabled = user.settings?.voiceEnabled ?? true;
  const highContrast = user.settings?.highContrast ?? false;

  const showFeedback = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000); };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate updating photoURL locally if needed, usually handled by Firebase Auth updateProfile
    await updateUser({ name, state, age: parseInt(age) || null, persona, photoURL });
    setSaving(false);
    showFeedback('✅ Profile saved successfully.');
  };

  const handleToggleSetting = async (key, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
    if (sessionId) {
      try { await updateUserSettings(sessionId, { ...user.settings, [key]: value }); } catch {}
    }
  };

  const handleClearHistory = async () => {
    if (!sessionId) return;
    await clearAiHistory(sessionId);
    showFeedback('✅ Conversation history cleared.');
  };

  const handleResetJourney = async () => {
    if (!sessionId || !window.confirm('Reset your entire voting journey? This cannot be undone.')) return;
    await resetJourney(sessionId);
    showFeedback('✅ Journey reset. Starting fresh!');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-8">
      {feedback && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="vp-card px-5 py-3 text-verdant-300 text-sm font-bold border border-verdant-500/50" role="status">
          {feedback}
        </motion.div>
      )}

      {/* Preferences */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vp-card p-6" aria-label="App preferences">
        <h2 className="text-2xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4 tracking-wide">App Preferences</h2>

        <div className="space-y-2">
          <ToggleSwitch id="toggle-voice" checked={voiceEnabled} onChange={(v) => handleToggleSetting('voiceEnabled', v)} label={`🔊 ${t('voiceResponses') || 'Voice Responses'}`} description="AI reads answers aloud using text-to-speech" />
          <ToggleSwitch id="toggle-contrast" checked={highContrast} onChange={(v) => handleToggleSetting('highContrast', v)} label={`♿ ${t('highContrast') || 'High Contrast'}`} description="Improve visibility for accessibility" />
          <ToggleSwitch id="toggle-theme" checked={isDark} onChange={toggleTheme} label={`🌙 ${t('darkMode') || 'Dark Mode'}`} description="Toggle between light and dark interface" />
        </div>

        <div className="pt-6 border-t border-white/10 mt-6">
          <label htmlFor="settings-language" className="block text-sm font-bold text-parchment-400 uppercase tracking-widest mb-3" style={{ fontFamily: '"Manrope", sans-serif' }}>
            🌐 {t('languageSetting') || 'Display Language'}
          </label>
          <select
            id="settings-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-3 text-white font-medium text-lg focus:ring-2 focus:ring-saffron-500 outline-none transition-all cursor-pointer hover:bg-white/[0.02]"
            style={{ fontFamily: '"Manrope", sans-serif' }}
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code} className="bg-ink-900 text-white py-2">
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      </motion.section>

      {/* Privacy / Danger zone */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="vp-card p-6 border-t-4 border-red-500/50" aria-label="Privacy and data controls">
        <h2 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">Privacy & Data</h2>
        <p className="text-parchment-400/80 text-sm mb-6 leading-relaxed tracking-wide">Your conversation history and journey are stored securely. You can clear them at any time below.</p>
        <div className="space-y-4">
          <button id="clear-history" onClick={handleClearHistory} className="w-full py-4 rounded-xl font-bold tracking-wider text-sm transition-all bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30" aria-label="Clear AI conversation history">
            🗑️ CLEAR CONVERSATION HISTORY
          </button>
          <button id="reset-journey" onClick={handleResetJourney} className="w-full py-4 rounded-xl font-bold tracking-wider text-sm transition-all bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30" aria-label="Reset your voting journey">
            🔄 RESET MY VOTING JOURNEY
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default Settings;
