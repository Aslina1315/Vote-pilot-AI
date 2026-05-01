/**
 * ProtectedRoute — wraps a Route element, not a layout wrapper.
 * If unauthenticated, redirects to /login. Shows loader while resolving.
 */

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-3xl shadow-glow">
            🗳️
          </div>
          <p className="text-slate-400 text-sm animate-pulse">Loading VotePilot AI…</p>
        </motion.div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if passed directly (layout wrapper pattern), else Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
