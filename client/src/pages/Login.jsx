/**
 * Login Page
 * Supports Google OAuth and Email/Password sign-in.
 * Switches between Sign In and Sign Up modes.
 * Includes password reset flow.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { signInWithGoogle, loginWithEmail, register, resetPassword, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [mode, setMode]           = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [name, setName]           = useState('');
  const [loading, setLoading]     = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [localError, setLocalError] = useState('');

  const error = authError || localError;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch { /* error shown via context */ }
    setLoading(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) { setLocalError('Please enter your name.'); setLoading(false); return; }
        await register(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      navigate(from, { replace: true });
    } catch { /* error shown via context */ }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch { /* error shown via context */ }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(30,58,138,0.4) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(29,78,216,0.2) 0%, transparent 60%), #0F172A',
      }}
    >
      {/* Background decorative rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full border border-primary-800/30 animate-pulse-soft" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full border border-primary-700/20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-3xl shadow-glow">
              🗳️
            </div>
            <div className="text-left">
              <h1 className="font-display text-2xl font-extrabold text-white leading-none">VotePilot AI</h1>
              <p className="text-primary-300 text-xs font-medium">AI Election Guide</p>
            </div>
          </motion.div>
          <p className="text-slate-400 text-sm">
            {mode === 'login'    && 'Sign in to continue your voting journey.'}
            {mode === 'register' && 'Create your free account to get started.'}
            {mode === 'reset'    && 'Enter your email to reset your password.'}
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span>🔒</span> Secured by Firebase
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span>🤖</span> Powered by Google AI
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="warning-badge mb-5"
                role="alert"
              >
                <span>⚠️ {error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success banner for reset */}
          {resetSent && (
            <div className="mb-5 p-3 rounded-xl bg-green-900/30 border border-green-700/50 text-green-300 text-sm text-center">
              ✅ Password reset email sent. Check your inbox.
            </div>
          )}

          {/* Google Sign-In */}
          {mode !== 'reset' && (
            <button
              id="google-signin-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                         bg-white text-slate-800 font-semibold text-sm hover:bg-slate-100
                         transition-all duration-200 mb-5 disabled:opacity-50"
              aria-label="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          )}

          {/* Divider */}
          {mode !== 'reset' && (
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          {/* Email/Password form */}
          <form onSubmit={mode === 'reset' ? handleReset : handleEmailSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="auth-name" className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="input-field"
                  required
                  maxLength={100}
                  aria-required="true"
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
                aria-required="true"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="auth-password" className="block text-xs font-medium text-slate-400 mb-1">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                  minLength={6}
                  aria-required="true"
                />
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
              aria-label={mode === 'login' ? 'Sign in' : mode === 'register' ? 'Create account' : 'Send reset email'}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Please wait…
                </span>
              ) : (
                mode === 'login'    ? '🔐 Sign In' :
                mode === 'register' ? '✨ Create Account' :
                '📧 Send Reset Email'
              )}
            </button>
          </form>

          {/* Mode switcher links */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <>
                <p className="text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => setMode('register')} className="text-primary-400 hover:text-primary-300 font-medium" id="switch-to-register">
                    Sign up free
                  </button>
                </p>
                <button onClick={() => setMode('reset')} className="text-slate-500 text-xs hover:text-slate-400" id="forgot-password">
                  Forgot your password?
                </button>
              </>
            )}
            {mode === 'register' && (
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-primary-400 hover:text-primary-300 font-medium" id="switch-to-login">
                  Sign in
                </button>
              </p>
            )}
            {mode === 'reset' && (
              <button onClick={() => setMode('login')} className="text-primary-400 hover:text-primary-300 text-sm font-medium" id="back-to-login">
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* ECI Trust footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          🗳️ Verified Election Guidance · Reference: Election Commission of India
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
