/**
 * Animated Voting Day Simulation
 * Fully interactive step-by-step illustrated simulation with Framer Motion.
 * 4 scenes: Arrival → ID Check → Voting Booth → Completion
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { addWarning } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── Scene definitions ───────────────────────────────────────────────── */
const buildScenes = (t) => [
  {
    id: 'arrival',
    icon: '🚗',
    title: 'Step 1: Arriving at the Polling Booth',
    subtitle: 'What to expect when you arrive',
    illustration: <ArrivalScene />,
    content: 'You have arrived at your designated polling station. Poll workers will be present to guide you through the process.',
    tips: [
      'Bring your Voter ID card (EPIC card)',
      'Check your assigned polling station on the ECI website in advance',
      'Polls are typically open 7 AM – 6 PM on election day',
      'You may bring a printed or digital copy of your voter slip',
    ],
    warning: null,
    question: 'Are you ready to enter the polling station?',
    options: [
      { label: '✅ Yes, I have everything', safe: true },
      { label: '❌ I forgot my ID', safe: false, warn: 'You must carry valid photo ID (EPIC card or approved alternative). Return home to collect it before polling ends.' },
    ],
  },
  {
    id: 'id_check',
    icon: '🪪',
    title: 'Step 2: Identity Verification',
    subtitle: 'A polling officer will verify your identity',
    illustration: <IDCheckScene />,
    content: 'A polling officer will check your name on the electoral roll and verify your photo ID before issuing your ballot paper.',
    tips: [
      'State your name and address clearly',
      'Accepted IDs: EPIC card, Aadhaar, PAN card, Passport, Driving Licence',
      'Your name must be on the local electoral roll',
      'If not found, you have the right to cast a Tendered Vote — do NOT leave!',
    ],
    warning: '⚠️ If your name is missing from the list, do not leave. Request assistance from the Presiding Officer.',
    question: 'Were you successfully verified?',
    options: [
      { label: '✅ Yes, I was verified', safe: true },
      { label: '⚠️ My name was not found', safe: false, warn: 'Request a Tendered Vote (Form 17B). You can still cast your vote — do not leave the polling booth!' },
    ],
  },
  {
    id: 'voting',
    icon: '🗳️',
    title: 'Step 3: Casting Your Vote',
    subtitle: 'Inside the voting booth',
    illustration: <VotingScene />,
    content: 'You will be shown to a private voting booth with an Electronic Voting Machine (EVM). Press the button next to your chosen candidate.',
    tips: [
      'Your vote is completely private — no one can see your choice',
      'Press the blue button firmly next to your candidate\'s symbol',
      'A beep sound confirms your vote has been recorded',
      'You can only vote once — make your choice carefully',
    ],
    warning: null,
    question: 'Have you successfully cast your vote?',
    options: [
      { label: '✅ Yes, I voted!', safe: true },
      { label: '❓ The machine malfunctioned', safe: false, warn: 'Immediately inform the Presiding Officer. Do NOT press any more buttons. The officer will assist you with the official procedure.' },
    ],
  },
  {
    id: 'complete',
    icon: '✅',
    title: 'Step 4: Voting Complete',
    subtitle: 'Your vote has been counted!',
    illustration: <CompletionScene />,
    content: 'Congratulations! You have successfully exercised your democratic right. Your ink-marked finger is proof of your participation.',
    tips: [
      'Indelible ink will be applied to your left index finger',
      'Collect your Voter Verified Paper Audit Trail (VVPAT) slip if available',
      'Wear your ink mark with pride — share your civic participation!',
      'You can track election results on the ECI official website',
    ],
    warning: null,
    question: null,
    options: [],
  },
];

/* ── SVG Illustrated Scenes ──────────────────────────────────────────── */
function ArrivalScene() {
  return (
    <div className="relative flex items-end justify-center gap-4 h-40">
      {/* Polling station building */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="w-28 h-24 bg-gradient-to-b from-primary-700 to-primary-900 rounded-t-2xl border-2 border-primary-600 flex flex-col items-center justify-center shadow-lg">
          <span className="text-2xl">🏛️</span>
          <span className="text-white text-xs font-bold mt-1">Polling Station</span>
        </div>
        <div className="w-8 h-10 bg-primary-500 rounded-t mx-auto border-x-2 border-primary-400" />
      </motion.div>
      {/* Walking character */}
      <motion.div
        initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
        className="flex flex-col items-center gap-1"
      >
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="text-4xl">🚶</motion.div>
        <div className="text-xs text-slate-300 bg-primary-900/60 px-2 py-1 rounded-lg border border-primary-700/50">You</div>
      </motion.div>
      {/* Road line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent rounded-full" />
    </div>
  );
}

function IDCheckScene() {
  return (
    <div className="relative flex items-center justify-center gap-6 h-40">
      {/* Officer */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-2">
        <div className="text-4xl">👮</div>
        <div className="text-xs text-blue-300 bg-blue-900/40 px-2 py-1 rounded-lg border border-blue-700/50">Polling Officer</div>
      </motion.div>
      {/* ID card animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}
        className="relative"
      >
        <div className="w-20 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg flex flex-col items-center justify-center border-2 border-orange-300 p-1">
          <div className="text-lg">🪪</div>
          <div className="text-white text-xs font-bold">EPIC Card</div>
        </div>
        <motion.div
          animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs"
        >✓</motion.div>
      </motion.div>
      {/* Voter */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center gap-2">
        <div className="text-4xl">🙋</div>
        <div className="text-xs text-slate-300 bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-600/50">You</div>
      </motion.div>
    </div>
  );
}

function VotingScene() {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="flex items-center justify-center gap-6 h-40">
      {/* EVM Machine */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
        <div className="w-24 h-28 bg-gradient-to-b from-slate-300 to-slate-400 rounded-xl border-2 border-slate-500 shadow-lg flex flex-col items-center justify-center gap-2 p-2">
          <div className="text-xs font-bold text-slate-700">EVM</div>
          {['🌸', '⭐', '🏠'].map((symbol, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPressed(i)}
              className={`w-full flex items-center gap-1 px-1 py-0.5 rounded text-xs transition-all
                ${pressed === i ? 'bg-green-400 text-green-900' : 'bg-white hover:bg-green-50 text-slate-700'}`}
            >
              <span>{symbol}</span>
              <div className={`ml-auto w-3 h-3 rounded-full border ${pressed === i ? 'bg-green-600 border-green-700' : 'bg-slate-200 border-slate-400'}`} />
            </motion.button>
          ))}
        </div>
        {pressed !== false && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-3 -right-3 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-sm shadow"
          >✓</motion.div>
        )}
      </motion.div>
      <div className="text-sm text-slate-300 max-w-[100px] text-center">
        {pressed !== false ? <span className="text-green-400 font-semibold">Vote recorded! ✅</span> : <span>Press a button to vote</span>}
      </div>
    </div>
  );
}

function CompletionScene() {
  return (
    <div className="flex flex-col items-center justify-center h-40 gap-3">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="text-6xl"
      >🎉</motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2">
        <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} className="text-3xl">☝️</motion.div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">Indelible Ink Applied</p>
          <p className="text-slate-400 text-xs">Your vote is counted!</p>
        </div>
      </motion.div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
            className="w-2 h-2 rounded-full bg-accent-400"
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Simulation Component ───────────────────────────────────────── */
const Simulation = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [started, setStarted]   = useState(false);
  const [step, setStep]         = useState(0);
  const [completed, setCompleted] = useState(false);
  const [warning, setWarning]   = useState(null);
  const [direction, setDirection] = useState(1);

  const scenes = buildScenes(t);
  const scene  = scenes[step];
  const total  = scenes.length;

  const handleOption = useCallback(async (opt) => {
    if (!opt.safe && opt.warn) {
      setWarning(opt.warn);
      if (currentUser) {
        try { await addWarning(currentUser.uid, opt.warn, scene.id); } catch {}
      }
      return;
    }
    setWarning(null);
    setDirection(1);
    if (step < total - 1) setStep((s) => s + 1);
    else setCompleted(true);
  }, [step, total, scene, currentUser]);

  const handleNext = useCallback(() => {
    setWarning(null);
    setDirection(1);
    if (step < total - 1) setStep((s) => s + 1);
    else setCompleted(true);
  }, [step, total]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    setWarning(null);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const restart = () => { setStep(0); setCompleted(false); setStarted(false); setWarning(null); };

  const variants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  };

  /* ── Start screen ─────────────────────────── */
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-12 animate-fade-in px-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="text-7xl mb-6">🗳️</motion.div>
        <h1 className="text-3xl font-display font-extrabold text-white mb-3">Voting Day Simulation</h1>
        <p className="text-slate-400 text-base mb-8 max-w-md">Experience a realistic step-by-step walkthrough of election day.</p>
        <div className="grid grid-cols-4 gap-3 mb-8 w-full max-w-sm">
          {scenes.map((s, i) => (
            <div key={s.id} className="glass-card p-3 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-xs text-slate-400">{`Step ${i + 1}`}</div>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          id="start-simulation" onClick={() => setStarted(true)}
          className="btn-primary px-10 py-4 text-base"
        >
          🚀 Start Simulation
        </motion.button>
        <p className="text-xs text-slate-600 mt-4">🗳️ Verified Election Guidance · Election Commission of India</p>
      </div>
    );
  }

  /* ── Completion screen ────────────────────── */
  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto flex flex-col items-center text-center py-10 px-4"
      >
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: 3, duration: 0.4 }} className="text-6xl mb-4">🏆</motion.div>
        <h1 className="text-3xl font-display font-extrabold text-white mb-2">Congratulations!</h1>
        <p className="text-slate-300 mb-6">You have successfully completed the voting simulation.</p>
        <div className="glass-card p-5 w-full mb-6 text-left">
          <h2 className="text-primary-300 font-semibold text-sm mb-3">✅ What you practised:</h2>
          {scenes.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-sm text-slate-300 py-1">
              <span className="text-green-400">✓</span> {s.title.replace(/^Step \d+: /, '')}
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={() => window.location.href = '/readiness'} className="btn-primary" id="sim-done-readiness">📊 View Readiness</button>
          <button onClick={restart} className="btn-secondary" id="sim-restart">🔄 Try Again</button>
        </div>
      </motion.div>
    );
  }

  /* ── Active simulation step ───────────────── */
  return (
    <div className="max-w-2xl mx-auto space-y-5 px-4 pb-6">
      {/* Progress bar */}
      <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Simulation step ${step + 1} of ${total}`}>
        {scenes.map((_, i) => (
          <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary-500' : 'bg-slate-700'}`} aria-hidden="true" />
        ))}
      </div>

      {/* Scene card with slide animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-primary-800/60 border border-primary-700/50 flex items-center justify-center text-2xl">{scene.icon}</div>
            <div>
              <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">Step {step + 1} of {total}</p>
              <h2 className="text-xl font-display font-bold text-white">{scene.title}</h2>
              <p className="text-slate-400 text-xs">{scene.subtitle}</p>
            </div>
          </div>

          {/* Illustration area */}
          <div className="glass-card p-4 mb-5 bg-primary-950/30 min-h-[160px] flex items-center justify-center">
            {scene.illustration}
          </div>

          {/* Content */}
          <p className="text-slate-300 text-sm mb-5 leading-relaxed">{scene.content}</p>

          {/* Tips */}
          <div className="glass-card p-4 mb-5 space-y-2">
            <p className="text-xs font-semibold text-primary-300 uppercase tracking-wider mb-3">💡 Important Tips</p>
            {scene.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-primary-400 flex-shrink-0 mt-0.5">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>

          {/* Static warning */}
          {scene.warning && (
            <div className="warning-badge mb-5"><span>{scene.warning}</span></div>
          )}

          {/* Dynamic mistake warning */}
          <AnimatePresence>
            {warning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="warning-badge mb-5 flex-col gap-3" role="alert" aria-live="assertive"
              >
                <p className="font-semibold text-amber-300">⚠️ Important Notice</p>
                <p className="text-sm">{warning}</p>
                <button onClick={handleNext} className="btn-accent text-sm self-start" id="sim-continue-after-warn">
                  I understand — Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options / Final next */}
          {!warning && (
            <div className="space-y-3">
              {scene.question && (
                <p className="text-white font-semibold text-sm">{scene.question}</p>
              )}
              {scene.options.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  {scene.options.map((opt, i) => (
                    <motion.button
                      key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      id={`sim-opt-${i}`}
                      onClick={() => handleOption(opt)}
                      className={`flex-1 ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleNext} className="btn-accent w-full text-base py-3" id="sim-final-btn"
                >
                  🎉 Complete Simulation
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      {step > 0 && !warning && (
        <button onClick={handleBack} className="btn-secondary text-sm" id="sim-back">← Back</button>
      )}
    </div>
  );
};

export default Simulation;
