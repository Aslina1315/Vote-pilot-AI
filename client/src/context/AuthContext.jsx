/**
 * AuthContext — Custom Authentication state manager using local Express/MongoDB backend.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getMe, upsertUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError]     = useState('');

  useEffect(() => {
    const initializeAuth = async () => {
      const sessionId = localStorage.getItem('vp_session_id');
      if (sessionId) {
        try {
          const user = await getMe(sessionId);
          setCurrentUser(user);
        } catch (err) {
          // Token/Session invalid or user deleted
          localStorage.removeItem('vp_session_id');
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  const clearError = () => setTimeout(() => setAuthError(''), 5000);

  const handleRegister = async (email, password, name) => {
    try {
      setAuthError('');
      const user = await registerUser(email, password, name);
      localStorage.setItem('vp_session_id', user.uid);
      setCurrentUser(user);
      
      // Initialize their profile in the database via upsertUser
      await upsertUser({
        sessionId: user.uid,
        name: user.displayName,
        settings: { voiceEnabled: true, language: 'en', highContrast: false },
      });
      
      return user;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      clearError();
      throw err;
    }
  };

  const handleEmailLogin = async (email, password) => {
    try {
      setAuthError('');
      const user = await loginUser(email, password);
      localStorage.setItem('vp_session_id', user.uid);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      clearError();
      throw err;
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('vp_session_id');
    setCurrentUser(null);
  };

  const handleResetPassword = async (email) => {
    // Basic stub since email sending requires SMTP
    setAuthError('Password reset is not configured for this demo environment.');
    clearError();
  };

  // Google Sign In is disabled in local auth mode
  const handleGoogleLogin = async () => {
    setAuthError('Google Sign-In requires Firebase, which is currently disabled. Please use Email/Password.');
    clearError();
  };

  const value = {
    currentUser, authLoading, authError,
    isConfigured: true, // Always true for local auth
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
