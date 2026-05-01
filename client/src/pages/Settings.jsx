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
  <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
    <div>
      <p className="text-white text-sm font-bold" style={{ fontFamily: '"Manrope", sans-serif' }}>{label}</p>
      {description && <p className="text-xs text-parchment-400 mt-1">{description}</p>}
    </div>
    <button
      id={id} role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0
        ${checked ? 'bg-saffron-500' : 'bg-ink-800 border border-white/10'}`}
    >
      <motion.span
        layout
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ left: checked ? '28px' : '4px' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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

      {/* Profile */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="vp-card p-6" aria-label="Profile settings">
        <h2 className="text-xl font-display font-bold text-white mb-5">My Civic Profile</h2>
        {currentUser && (
          <div className="flex items-center gap-4 p-4 bg-ink-900 rounded-xl mb-6 border border-white/5">
            {photoURL || currentUser.photoURL
              ? <img src={photoURL || currentUser.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-saffron-500" />
              : <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #EA580C, #F97316)' }}>{(name || currentUser.displayName || currentUser.email || 'V').charAt(0).toUpperCase()}</div>
            }
            <div>
              <p className="text-white text-base font-bold">{name || currentUser.displayName || 'Voter'}</p>
              <p className="text-parchment-400 text-xs mt-0.5">{currentUser.email}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4" noValidate>
          <div>
            <label htmlFor="settings-name" className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Display Name</label>
            <input id="settings-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" maxLength={100} />
          </div>
          <div>
            <label htmlFor="settings-photo" className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Profile Photo URL</label>
            <input id="settings-photo" type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} className="input-field" placeholder="https://example.com/photo.jpg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="settings-state" className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">State / UT</label>
              <select id="settings-state" value={state} onChange={(e) => setState(e.target.value)} className="input-field">
                <option value="">— Select —</option>
                {IN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="settings-age" className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Age</label>
              <input id="settings-age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="input-field" placeholder="18+" min={18} max={120} />
            </div>
          </div>
          <div>
            <label htmlFor="settings-persona" className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Voter Type</label>
            <select id="settings-persona" value={persona} onChange={(e) => setPersona(e.target.value)} className="input-field">
              {PERSONAS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <button id="settings-save" type="submit" disabled={saving} className="btn-primary w-full mt-2" aria-label="Save profile">
            {saving ? <div className="dot-loader"><span/><span/><span/></div> : `💾 Save Profile`}
          </button>
        </form>
      </motion.section>

      {/* Preferences */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vp-card p-6" aria-label="App preferences">
        <h2 className="text-xl font-display font-bold text-white mb-4">Preferences</h2>

        <ToggleSwitch id="toggle-voice" checked={voiceEnabled} onChange={(v) => handleToggleSetting('voiceEnabled', v)} label={`🔊 ${t('voiceResponses') || 'Voice Responses'}`} description="AI reads answers aloud using text-to-speech" />
        <ToggleSwitch id="toggle-contrast" checked={highContrast} onChange={(v) => handleToggleSetting('highContrast', v)} label={`♿ ${t('highContrast') || 'High Contrast'}`} description="Improve visibility for accessibility" />
        <ToggleSwitch id="toggle-theme" checked={isDark} onChange={toggleTheme} label={`🌙 ${t('darkMode') || 'Dark Mode'}`} description="Toggle between light and dark interface" />

        <div className="pt-4 border-t border-white/5 mt-4">
          <label htmlFor="settings-language" className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-2">
            🌐 {t('languageSetting') || 'Language'}
          </label>
          <select
            id="settings-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field"
          >
            {supportedLanguages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      </motion.section>

      {/* Privacy / Danger zone */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="vp-card p-6" aria-label="Privacy and data controls">
        <h2 className="text-xl font-display font-bold text-white mb-4">Privacy & Data</h2>
        <p className="text-parchment-400 text-sm mb-4">Your conversation history and journey are stored securely. Clear them any time.</p>
        <div className="space-y-3">
          <button id="clear-history" onClick={handleClearHistory} className="btn-ghost w-full" style={{ color: '#F87171', borderColor: 'rgba(248, 113, 113, 0.3)' }} aria-label="Clear AI conversation history">
            🗑️ Clear Conversation History
          </button>
          <button id="reset-journey" onClick={handleResetJourney} className="btn-ghost w-full" style={{ color: '#F87171', borderColor: 'rgba(248, 113, 113, 0.3)' }} aria-label="Reset your voting journey">
            🔄 Reset My Voting Journey
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default Settings;
