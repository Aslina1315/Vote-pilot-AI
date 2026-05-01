/**
 * JourneyTracker Component
 * Visualizes the 4-step voting journey with a progress line.
 * Steps: Eligibility → Documents → Registration → Voting Ready
 */

import React from 'react';
import useJourney from '../../hooks/useJourney';

const STEPS = [
  { key: 'eligibility',  label: 'Eligibility',    icon: '✅', desc: 'Confirm you are eligible to vote' },
  { key: 'documents',    label: 'Documents',       icon: '📄', desc: 'Gather required ID and documents' },
  { key: 'registration', label: 'Registration',    icon: '📝', desc: 'Register or verify your registration' },
  { key: 'voting',       label: 'Voting Ready',    icon: '🗳️', desc: 'Learn your polling place and process' },
];

const JourneyTracker = ({ onStepClick }) => {
  const { steps, currentStage, readinessScore, updating } = useJourney();

  const getStepState = (key, index) => {
    if (steps[key]?.completed) return 'complete';
    if (key === currentStage) return 'active';
    return 'pending';
  };

  return (
    <section aria-label="Voting Journey Progress" className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-white">Your Voting Journey</h2>
        <span className="text-2xl font-bold text-primary-300">{readinessScore}%</span>
      </div>

      {/* Readiness bar */}
      <div className="mb-8">
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="readiness-bar h-full"
            style={{ width: `${readinessScore}%` }}
            role="progressbar"
            aria-valuenow={readinessScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Voting readiness: ${readinessScore}%`}
          />
        </div>
      </div>

      {/* Steps */}
      <ol className="relative" aria-label="Journey steps">
        {STEPS.map((step, index) => {
          const state = getStepState(step.key, index);
          const isLast = index === STEPS.length - 1;

          return (
            <li key={step.key} className="flex gap-4 mb-0">
              {/* Step circle + connector line */}
              <div className="flex flex-col items-center">
                <button
                  id={`step-${step.key}`}
                  className={`step-circle ${state} transition-all`}
                  onClick={() => onStepClick && onStepClick(step.key, state)}
                  disabled={updating || state === 'pending'}
                  aria-label={`${step.label}: ${state}`}
                  aria-pressed={state === 'complete'}
                  title={state === 'pending' ? 'Complete previous steps first' : `Mark ${step.label} complete`}
                >
                  {state === 'complete' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                </button>
                {!isLast && (
                  <div
                    className={`w-0.5 h-12 mt-1 transition-colors duration-500
                      ${steps[step.key]?.completed ? 'bg-primary-500' : 'bg-slate-700'}`}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Step details */}
              <div className={`pb-12 flex-1 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span aria-hidden="true" className="text-lg">{step.icon}</span>
                  <h3 className={`font-semibold text-sm ${
                    state === 'complete' ? 'text-primary-300 line-through opacity-70'
                    : state === 'active' ? 'text-white'
                    : 'text-slate-500'
                  }`}>
                    {step.label}
                  </h3>
                  {state === 'active' && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary-800 text-primary-300 border border-primary-700/50">
                      Current
                    </span>
                  )}
                </div>
                <p className={`text-xs ${state === 'pending' ? 'text-slate-600' : 'text-slate-400'}`}>
                  {step.desc}
                </p>
                {steps[step.key]?.completedAt && (
                  <p className="text-xs text-primary-400/60 mt-1">
                    Completed {new Date(steps[step.key].completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default JourneyTracker;
