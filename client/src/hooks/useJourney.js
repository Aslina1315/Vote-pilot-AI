/**
 * useJourney Hook
 * Manages voting journey state and progress updates.
 */

import { useState, useCallback } from 'react';
import { updateJourneyStep, resetJourney as resetJourneyApi } from '../services/api';
import { useApp } from '../context/AppContext';

const useJourney = () => {
  const { sessionId, journey, refreshJourney } = useApp();
  const [updating, setUpdating] = useState(false);
  const [tip, setTip] = useState('');

  /**
   * Marks a journey step as complete and refreshes journey state.
   * @param {string} step - Journey step name
   */
  const completeStep = useCallback(async (step) => {
    if (!sessionId || updating) return;
    setUpdating(true);
    try {
      const data = await updateJourneyStep(sessionId, step, true);
      if (data.tip) setTip(data.tip);
      await refreshJourney();
    } catch (err) {
      console.error('[useJourney] Error completing step:', err.message);
    } finally {
      setUpdating(false);
    }
  }, [sessionId, updating, refreshJourney]);

  /** Resets the entire journey back to the start */
  const resetJourney = useCallback(async () => {
    if (!sessionId) return;
    setUpdating(true);
    try {
      await resetJourneyApi(sessionId);
      setTip('');
      await refreshJourney();
    } catch (err) {
      console.error('[useJourney] Error resetting:', err.message);
    } finally {
      setUpdating(false);
    }
  }, [sessionId, refreshJourney]);

  const readinessScore = journey?.readinessScore ?? 0;
  const steps = journey?.steps ?? {
    eligibility:  { completed: false },
    documents:    { completed: false },
    registration: { completed: false },
    voting:       { completed: false },
  };
  const currentStage = journey?.currentStage ?? 'eligibility';
  const warnings = journey?.warnings ?? [];

  return {
    steps,
    currentStage,
    readinessScore,
    warnings,
    tip,
    updating,
    completeStep,
    resetJourney,
  };
};

export default useJourney;
