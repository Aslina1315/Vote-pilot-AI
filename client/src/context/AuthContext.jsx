/**
 * AuthContext — Firebase Authentication state manager.
 * Gracefully handles demo mode when Firebase is not yet configured.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isConfigured, signInWithGoogle as fbGoogle, loginWithEmail as fbEmail, registerWithEmail, logout as fbLogout, resetPassword } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { upsertUser } from '../services/api';

const AuthContext = createContext(null);

// ─── Demo user used when Firebase is not yet configured ──────────────────────
const DEMO_USER = {
  uid:         'demo-session',
  displayName: 'Demo Voter',
  email:       'demo@votepilot.ai',
  photoURL:    null,
  isDemo:      true,
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError]     = useState('');

  useEffect(() => {
    if (!isConfigured || !auth) {
      // Firebase not configured — use demo user so app is fully navigable
      console.warn('[VotePilot] Firebase not configured. Running in demo mode.');
      localStorage.setItem('vp_session_id', DEMO_USER.uid);
      setCurrentUser(DEMO_USER);
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        localStorage.setItem('vp_session_id', user.uid);
        try {
          await upsertUser({
            sessionId: user.uid,
            name: user.displayName || 'Voter',
            settings: { voiceEnabled: true, language: 'en', highContrast: false },
          });
        } catch {}
      }
    });
    return unsubscribe;
  }, []);

  const clearError = () => setTimeout(() => setAuthError(''), 5000);

  const handleGoogleLogin = async () => {
    if (!isConfigured) return demoNotice();
    try {
      setAuthError('');
      return await fbGoogle();
    } catch (err) { setAuthError(getFriendlyError(err.code)); clearError(); throw err; }
  };

  const handleEmailLogin = async (email, password) => {
    if (!isConfigured) return demoNotice();
    try {
      setAuthError('');
      return await fbEmail(email, password);
    } catch (err) { setAuthError(getFriendlyError(err.code)); clearError(); throw err; }
  };

  const handleRegister = async (email, password, name) => {
    if (!isConfigured) return demoNotice();
    try {
      setAuthError('');
      return await registerWithEmail(email, password, name);
    } catch (err) { setAuthError(getFriendlyError(err.code)); clearError(); throw err; }
  };

  const handleLogout = async () => {
    if (isConfigured && auth) await fbLogout();
    localStorage.removeItem('vp_session_id');
    setCurrentUser(null);
  };

  const handleResetPassword = async (email) => {
    if (!isConfigured) return;
    try { await resetPassword(email); }
    catch (err) { setAuthError(getFriendlyError(err.code)); }
  };

  const demoNotice = () => {
    setAuthError('Firebase is not yet configured. The app is running in demo mode. Add your Firebase credentials to client/.env to enable authentication.');
    clearError();
  };

  const value = {
    currentUser, authLoading, authError,
    isConfigured,
    signInWithGoogle: handleGoogleLogin,
    loginWithEmail:   handleEmailLogin,
    register:         handleRegister,
    logout:           handleLogout,
    resetPassword:    handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const getFriendlyError = (code) => {
  const m = {
    'auth/email-already-in-use':   'This email is already registered.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many attempts. Please wait.',
    'auth/popup-closed-by-user':   'Sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return m[code] || 'An unexpected error occurred.';
};
