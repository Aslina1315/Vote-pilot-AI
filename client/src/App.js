/**
 * App.js — Root with Auth, Theme, Language, and Protected Routes
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider }      from './context/AppContext';
import { AuthProvider }     from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider }    from './context/ThemeContext';
import AppLayout            from './components/layout/AppLayout';
import ProtectedRoute       from './components/auth/ProtectedRoute';

// Lazy-load all pages for efficient code splitting
const Login      = lazy(() => import('./pages/Login'));
const Home       = lazy(() => import('./pages/Home'));
const Assistant  = lazy(() => import('./pages/Assistant'));
const Journey    = lazy(() => import('./pages/Journey'));
const Simulation = lazy(() => import('./pages/Simulation'));
const Readiness  = lazy(() => import('./pages/Readiness'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Settings   = lazy(() => import('./pages/Settings'));
const Navigator  = lazy(() => import('./pages/Navigator'));

// Minimal full-page loader (shows during code-split loads)
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-surface-dark" role="status" aria-label="Loading page">
    <div className="dot-loader"><span /><span /><span /></div>
  </div>
);

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public route — Login */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes — require Firebase auth */}
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/"            element={<Home />} />
                  <Route path="/assistant"   element={<Assistant />} />
                  <Route path="/journey"     element={<Journey />} />
                  <Route path="/simulation"  element={<Simulation />} />
                  <Route path="/readiness"   element={<Readiness />} />
                  <Route path="/dashboard"   element={<Dashboard />} />
                  <Route path="/settings"    element={<Settings />} />
                  <Route path="/navigator"   element={<Navigator />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
