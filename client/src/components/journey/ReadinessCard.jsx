/**
 * ReadinessCard Component
 * Shows readiness score with animated ring and next-action suggestion.
 */

import React from 'react';
import useJourney from '../../hooks/useJourney';

const ReadinessCard = () => {
  const { readinessScore, warnings, tip } = useJourney();

  // SVG circle dimensions for the readiness ring
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (readinessScore / 100) * circumference;

  // Color based on score
  const scoreColor =
    readinessScore >= 75 ? '#22C55E'
    : readinessScore >= 50 ? '#3B82F6'
    : readinessScore >= 25 ? '#F59E0B'
    : '#EF4444';

  return (
    <article className="glass-card p-6" aria-label="Voting readiness summary">
      <h2 className="text-xl font-display font-bold text-white mb-6">My Voting Progress</h2>

      {/* Circular progress ring */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-36 h-36" role="img" aria-label={`${readinessScore}% ready to vote`}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
            {/* Background track */}
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1E293B" strokeWidth="10" />
            {/* Progress arc */}
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.5s' }}
            />
          </svg>
          {/* Score label in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{readinessScore}%</span>
            <span className="text-xs text-slate-400">Ready</span>
          </div>
        </div>
      </div>

      {/* Readiness label */}
      <div className="text-center mb-6">
        <p className="font-semibold text-white">
          {readinessScore === 100 ? '🎉 Fully Voting Ready!'
           : readinessScore >= 75 ? '🔵 Almost There!'
           : readinessScore >= 50 ? '🟡 Good Progress'
           : readinessScore >= 25 ? '🟠 Getting Started'
           : '🔴 Just Beginning'}
        </p>
        {tip && (
          <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">{tip}</p>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-amber-400 mb-2">⚠️ Warnings</h3>
          <ul className="space-y-2" aria-label="Voting warnings">
            {warnings.slice(-3).map((w, i) => (
              <li key={i} className="warning-badge">
                <span aria-hidden="true">⚠️</span>
                <span>{w.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default ReadinessCard;
