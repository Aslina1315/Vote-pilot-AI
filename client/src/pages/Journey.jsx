/**
 * Journey Page
 * Displays the full voting journey tracker and quick-action step controls.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import JourneyTracker from '../components/journey/JourneyTracker';
import useJourney from '../hooks/useJourney';

const Journey = () => {
  const { completeStep, resetJourney, updating, warnings, tip } = useJourney();

  const [activeQuestion, setActiveQuestion] = React.useState(null);
  const [showGuidance, setShowGuidance] = React.useState(null);

  const handleStepClick = (key, state) => {
    if (state === 'active' || state === 'complete') {
      setActiveQuestion(key);
      setShowGuidance(null);
    }
  };

  const getQuestionText = (key) => {
    switch (key) {
      case 'eligibility': return 'Have you verified that you are an Indian citizen over 18 years old?';
      case 'documents': return 'Do you have your EPIC card or an approved photo ID (like Aadhaar/PAN)?';
      case 'registration': return 'Have you registered via Form 6 and verified your name is on the Electoral Roll?';
      case 'voting': return 'Do you know where your polling station is and how to use the EVM?';
      default: return 'Have you completed this step?';
    }
  };

  const getGuidanceText = (key) => {
    switch (key) {
      case 'eligibility': return 'No problem! You can ask the AI Helper about eligibility, or check the official ECI criteria online.';
      case 'documents': return 'You will need an ID to vote. Common options are EPIC, Aadhaar, PAN, or Passport. Ask the AI Helper for a full list.';
      case 'registration': return 'You need to register to vote! Visit voters.eci.gov.in and fill out Form 6, or ask the AI Helper for step-by-step guidance.';
      case 'voting': return 'Let\'s get you prepared! You can use the "Find My Booth" and "Practice Voting" tools from the menu to get ready.';
      default: return 'Please ask the AI Helper for guidance on this step.';
    }
  };

  const handleAnswerYes = () => {
    if (activeQuestion) completeStep(activeQuestion);
    setActiveQuestion(null);
  };

  const handleAnswerNo = () => {
    setShowGuidance(activeQuestion);
    setActiveQuestion(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Active Question Modal/Card */}
      {activeQuestion && (
        <div className="glass-card p-6 border-l-4 border-saffron-500 bg-ink-900/90 shadow-xl mb-6">
          <h3 className="text-sm font-bold text-saffron-400 uppercase tracking-wider mb-2">Step Verification</h3>
          <p className="text-white text-lg mb-4">{getQuestionText(activeQuestion)}</p>
          <div className="flex gap-3">
            <button onClick={handleAnswerYes} className="btn-primary flex-1">✅ Yes, I have</button>
            <button onClick={handleAnswerNo} className="btn-secondary flex-1">❌ Not yet</button>
          </div>
        </div>
      )}

      {/* Guidance Card (Shown if answered NO) */}
      {showGuidance && (
        <div className="glass-card p-6 border-l-4 border-blue-500 bg-ink-900/90 shadow-xl mb-6">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2">How to Complete This Step</h3>
          <p className="text-white text-md mb-4">{getGuidanceText(showGuidance)}</p>
          <div className="flex gap-3">
            <Link to="/assistant" className="btn-primary flex-1 text-center">🤖 Ask AI Helper</Link>
            <button onClick={() => setShowGuidance(null)} className="btn-secondary flex-1">Close</button>
          </div>
        </div>
      )}

      {/* Journey tracker */}
      <JourneyTracker onStepClick={handleStepClick} />

      {/* AI Tip */}
      {tip && (
        <div className="glass-card p-5 border-l-4 border-accent-500" role="note" aria-label="AI tip">
          <p className="text-xs text-accent-400 font-semibold mb-1 uppercase tracking-wider">💡 VotePilot Tip</p>
          <p className="text-slate-200 text-sm">{tip}</p>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <section aria-label="Journey warnings" className="glass-card p-5 space-y-2">
          <h2 className="text-sm font-bold text-amber-400 mb-3">⚠️ Things to Watch Out For</h2>
          {warnings.map((w, i) => (
            <div key={i} className="warning-badge">
              <span aria-hidden="true">⚠️</span>
              <span className="text-sm">{w.message}</span>
            </div>
          ))}
        </section>
      )}

      {/* Action row */}
      <div className="flex gap-3 flex-wrap">
        <Link to="/assistant" className="btn-primary flex-1 text-center" id="journey-ask-ai">
          🤖 Ask AI Helper
        </Link>
        <button
          onClick={resetJourney}
          disabled={updating}
          className="btn-secondary flex-1"
          id="journey-reset"
          aria-label="Reset your entire journey"
        >
          {updating ? '⏳ Resetting…' : '🔄 Start Over'}
        </button>
      </div>

      {/* Info cards */}
      <section aria-label="Journey resources" className="grid grid-cols-2 gap-4">
        {[
          { icon: '🗳️', label: 'Register to Vote', url: 'https://voters.eci.gov.in/' },
          { icon: '📍', label: 'Find Polling Place', url: 'https://electoralsearch.eci.gov.in/' },
          { icon: '🪪', label: 'Know Your Candidate', url: 'https://affidavit.eci.gov.in/' },
          { icon: '📅', label: 'Election Results', url: 'https://results.eci.gov.in/' },
        ].map((r) => (
          <a
            key={r.label}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-4 hover:scale-[1.02] transition-transform text-center"
            aria-label={`External resource: ${r.label}`}
          >
            <div className="text-2xl mb-2" aria-hidden="true">{r.icon}</div>
            <p className="text-xs font-semibold text-primary-300">{r.label}</p>
            <p className="text-xs text-slate-500 mt-1">eci.gov.in ↗</p>
          </a>
        ))}
      </section>
    </div>
  );
};

export default Journey;
