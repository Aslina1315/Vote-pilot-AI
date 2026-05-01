/**
 * Readiness Page
 * Full readiness score breakdown with next-action suggestions and AI tips.
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReadinessCard from '../components/journey/ReadinessCard';
import useJourney from '../hooks/useJourney';
import { getAiGuidance } from '../services/api';
import { useApp } from '../context/AppContext';

const STEP_LABELS = {
  eligibility:  { label: 'Eligibility',  icon: '✅', desc: 'Confirmed you can vote', points: 25 },
  documents:    { label: 'Documents',    icon: '📄', desc: 'Gathered required ID',  points: 25 },
  registration: { label: 'Registration', icon: '📝', desc: 'Registered to vote',    points: 25 },
  voting:       { label: 'Voting Ready', icon: '🗳️', desc: 'Learned voting process', points: 25 },
};

const Readiness = () => {
  const { steps, readinessScore, currentStage } = useJourney();
  const { user } = useApp();
  const [guidance, setGuidance] = useState('');
  const [loadingGuidance, setLoadingGuidance] = useState(false);

  // Fetch AI guidance for the current stage
  useEffect(() => {
    const fetchGuidance = async () => {
      setLoadingGuidance(true);
      try {
        const data = await getAiGuidance(currentStage, user.persona || 'unknown');
        setGuidance(data.tip);
      } catch {
        setGuidance('Visit vote.gov for official guidance on your next step.');
      } finally {
        setLoadingGuidance(false);
      }
    };
    fetchGuidance();
  }, [currentStage, user.persona]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Readiness card */}
      <ReadinessCard />

      {/* Score breakdown */}
      <section className="glass-card p-6" aria-label="Score breakdown by step">
        <h2 className="text-xl font-display font-bold text-white mb-5">Progress Breakdown</h2>
        <div className="space-y-4">
          {Object.entries(STEP_LABELS).map(([key, info]) => {
            const done = steps[key]?.completed;
            return (
              <div key={key} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl
                  ${done ? 'bg-primary-800/60 border border-primary-600/50' : 'bg-slate-800 border border-slate-700'}`}
                  aria-hidden="true"
                >
                  {info.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm font-semibold ${done ? 'text-white' : 'text-slate-500'}`}>
                      {info.label}
                    </span>
                    <span className={`text-sm font-bold ${done ? 'text-primary-300' : 'text-slate-600'}`}>
                      {done ? `+${info.points}` : '0'} pts
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: done ? '100%' : '0%',
                        background: done
                          ? 'linear-gradient(90deg, #1E3A8A, #3B82F6)'
                          : 'transparent',
                      }}
                      aria-hidden="true"
                    />
                  </div>
                  <p className={`text-xs mt-1 ${done ? 'text-slate-400' : 'text-slate-600'}`}>{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI next-step guidance */}
      <section className="glass-card p-6 border-l-4 border-accent-500" aria-label="AI next step recommendation">
        <h2 className="text-sm font-semibold text-accent-400 uppercase tracking-wider mb-3">🤖 Your Next Step</h2>
        {loadingGuidance ? (
          <div className="dot-loader" aria-label="Loading AI guidance…"><span /><span /><span /></div>
        ) : (
          <p className="text-slate-200 text-sm leading-relaxed">{guidance}</p>
        )}
        <Link to="/assistant" className="btn-primary mt-4 text-sm inline-flex" id="readiness-ask-ai">
          Ask AI for Help →
        </Link>
      </section>

      {/* Share / motivate */}
      {readinessScore === 100 && (
        <div className="glass-card p-6 text-center border border-accent-500/30 animate-slide-up" role="status">
          <div className="text-4xl mb-3" aria-hidden="true">🏆</div>
          <h2 className="text-xl font-bold text-white mb-2">100% Voting Ready!</h2>
          <p className="text-slate-400 text-sm">You've completed every step. Now go make your voice heard on election day!</p>
        </div>
      )}
    </div>
  );
};

export default Readiness;
