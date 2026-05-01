/**
 * AppContext
 * Global state management for user session, journey, and settings.
 * Uses React Context + useReducer for predictable state updates.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getJourney, upsertUser, getUser } from '../services/api';

// ─── Initial State ───────────────────────────────────────────────────────────
const initialState = {
  sessionId: null,
  user: {
    name: 'Voter',
    state: '',
    age: null,
    persona: 'unknown',
    settings: { voiceEnabled: true, language: 'en-US', highContrast: false },
  },
  journey: null,
  sidebarOpen: false,
  loading: false,
  error: null,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'SET_JOURNEY':
      return { ...state, journey: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, user: { ...state.user, settings: { ...state.user.settings, ...action.payload } } };
    default:
      return state;
  }
};

// ─── Context ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * On mount: retrieve or create a session ID.
   * Sessions persist across page reloads via localStorage.
   */
  useEffect(() => {
    const stored = localStorage.getItem('vp_session_id');
    const sessionId = stored || uuidv4();
    if (!stored) localStorage.setItem('vp_session_id', sessionId);
    dispatch({ type: 'SET_SESSION', payload: sessionId });
  }, []);

  /**
   * When sessionId is set, load user and journey from backend.
   */
  useEffect(() => {
    if (!state.sessionId) return;

    const loadData = async () => {
      try {
        const [journeyData, userData] = await Promise.allSettled([
          getJourney(state.sessionId),
          getUser(state.sessionId),
        ]);

        if (journeyData.status === 'fulfilled') {
          dispatch({ type: 'SET_JOURNEY', payload: journeyData.value.journey });
        }
        if (userData.status === 'fulfilled') {
          dispatch({ type: 'SET_USER', payload: userData.value });
        }
      } catch {
        // Non-fatal — new user will be created on first interaction
      }
    };

    loadData();
  }, [state.sessionId]);

  /** Refresh journey data from backend */
  const refreshJourney = useCallback(async () => {
    if (!state.sessionId) return;
    try {
      const data = await getJourney(state.sessionId);
      dispatch({ type: 'SET_JOURNEY', payload: data.journey });
    } catch {
      // Silent fail — journey will load on next refresh
    }
  }, [state.sessionId]);

  /** Update user profile */
  const updateUser = useCallback(async (updates) => {
    dispatch({ type: 'SET_USER', payload: updates });
    if (state.sessionId) {
      try {
        await upsertUser({ sessionId: state.sessionId, ...state.user, ...updates });
      } catch {
        // Silent — local state updated regardless
      }
    }
  }, [state.sessionId, state.user]);

  const value = {
    ...state,
    dispatch,
    refreshJourney,
    updateUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/** Custom hook for easy context access */
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
