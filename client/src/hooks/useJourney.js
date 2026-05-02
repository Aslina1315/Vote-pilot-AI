/**
 * useJourney Hook
 * Manages voting journey state and progress updates.
 */

import { useState, useCallback } from 'react';
import { updateJourneyStep, resetJourney as resetJourneyApi } from '../services/api';
import { useApp } from '../context/AppContext';

const useJourney = () => {
  const { sessionId, journey, refreshJourney, dispatch } = useApp();
  const [updating, setUpdating] = useState(false);
  const [tip, setTip] = useState('');

  /**
   * Marks a journey step as complete and refreshes journey state.
   * @param {string} step - Journey step name
   */
  const completeStep = useCallback(async (step) => {
    if (!sessionId || updating) return;
    setUpdating(true);

    const currentSteps = journey?.steps || {
      eligibility: { completed: false },
      documents: { completed: false },
      registration: { completed: false },
      voting: { completed: false },
    };
    
    const updatedSteps = { ...currentSteps, [step]: { completed: true, completedAt: new Date() } };
    
    const stepOrder = ['eligibility', 'documents', 'registration', 'voting'];
    let nextStage = 'complete';
    for (const s of stepOrder) {
      if (!updatedSteps[s]?.completed) {
        nextStage = s;
        break;
      }
    }
    
    const completedCount = Object.values(updatedSteps).filter(s => s.completed).length;
    const newScore = Math.round((completedCount / 4) * 100);

    const optimisticJourney = {
      ...journey,
      steps: updatedSteps,
      currentStage: nextStage,
      readinessScore: newScore
    };

    try {
      const data = await updateJourneyStep(sessionId, step, true);
      if (data.tip) setTip(data.tip);
      await refreshJourney();
    } catch (err) {
      console.error('[useJourney] Error completing step (offline mode):', err.message);
      // Fallback: manually update journey in context if backend fails
      dispatch({ type: 'SET_JOURNEY', payload: optimisticJourney });
    } finally {
      setUpdating(false);
    }
  }, [sessionId, updating, refreshJourney, journey, dispatch]);

  /** Resets the entire journey back to the start */
  const resetJourney = useCallback(async () => {
    if (!sessionId) return;
    setUpdating(true);
    try {
      await resetJourneyApi(sessionId);
      setTip('');
      await refreshJourney();
    } catch (err) {
      console.error('[useJourney] Error resetting (offline mode):', err.message);
      dispatch({ type: 'SET_JOURNEY', payload: {
        steps: {
          eligibility: { completed: false },
          documents: { completed: false },
          registration: { completed: false },
          voting: { completed: false },
        },
        currentStage: 'eligibility',
        readinessScore: 0,
        warnings: []
      }});
      setTip('');
    } finally {
      setUpdating(false);
    }
  }, [sessionId, refreshJourney, dispatch]);

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
