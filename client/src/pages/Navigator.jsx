/**
 * Smart Polling Navigator
 * Allows users to find and navigate to their polling station.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOCK_POLLING_STATION = {
  name: 'Govt. Higher Secondary School, Main Hall',
  address: '12 Gandhi Road, Model Town',
  distance: '1.2 km',
  time: '15 mins walking',
  directions: [
    'Head north on your street for 200m',
    'Turn right onto Gandhi Road',
    'Walk straight for 800m',
    'The school will be on your left',
  ],
  reminders: [
    'Carry your original Voter ID or Aadhaar Card',
    'Best time to visit: 7 AM to 10 AM (less crowded)',
    'Do not carry mobile phones inside the booth'
  ]
};

const Navigator = () => {
  const [formData, setFormData] = useState({ name: '', state: '', city: '', pincode: '', epic: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.state || !formData.city || !formData.pincode) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResult(MOCK_POLLING_STATION);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Smart Polling Navigator</h1>
        <p className="text-parchment-400">Find your designated polling booth and get turn-by-turn directions.</p>
      </motion.div>

      {!result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vp-card p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">State *</label>
                <input required type="text" className="input-field" placeholder="e.g. Maharashtra"
                  value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">City/District *</label>
                <input required type="text" className="input-field" placeholder="e.g. Mumbai"
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Pincode *</label>
                <input required type="text" className="input-field" placeholder="e.g. 400001"
                  value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-parchment-400 uppercase tracking-wider mb-1">Voter ID (EPIC) - Optional</label>
                <input type="text" className="input-field" placeholder="e.g. ABC1234567"
                  value={formData.epic} onChange={e => setFormData({...formData, epic: e.target.value})} />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary w-full mt-4">
              {loading ? (
                <div className="dot-loader"><span/><span/><span/></div>
              ) : (
                '📍 Locate My Polling Station'
              )}
            </button>
          </form>
        </motion.div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid md:grid-cols-2 gap-6">
          {/* Info Card */}
          <div className="vp-card vp-card-saffron p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-saffron-400 uppercase tracking-widest mb-1">Your Polling Station</h2>
              <h3 className="text-xl font-bold text-white">{result.name}</h3>
              <p className="text-parchment-400 text-sm">{result.address}</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-ink-800 p-3 rounded-xl border border-white/10 flex-1 text-center">
                <span className="block text-xl mb-1">🚶</span>
                <span className="block text-white font-bold text-sm">{result.distance}</span>
              </div>
              <div className="bg-ink-800 p-3 rounded-xl border border-white/10 flex-1 text-center">
                <span className="block text-xl mb-1">⏱️</span>
                <span className="block text-white font-bold text-sm">{result.time}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-parchment-400 uppercase tracking-wider mb-3">Smart Guidance</h4>
              <ul className="space-y-2">
                {result.reminders.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-parchment-300">
                    <span className="text-saffron-500">✓</span> {r}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => window.open(`https://maps.google.com/?q=${result.address}`, '_blank')} className="btn-primary w-full">
              🗺️ Open in Google Maps
            </button>
            <button onClick={() => setResult(null)} className="btn-ghost w-full">Search Again</button>
          </div>

          {/* Map & Directions */}
          <div className="vp-card p-6 flex flex-col">
            <div className="bg-ink-900 rounded-xl flex-1 border border-white/10 mb-4 flex items-center justify-center relative overflow-hidden" style={{ minHeight: '200px' }}>
              {/* Mock map UI */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#60A5FA 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="z-10 text-center">
                <div className="text-4xl mb-2 animate-bounce">📍</div>
                <p className="text-parchment-300 text-sm font-bold">Interactive Map Route</p>
                <p className="text-parchment-500 text-xs">Simulated for {formData.city}</p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-parchment-400 uppercase tracking-wider mb-3">Turn-by-turn Directions</h4>
            <div className="space-y-3">
              {result.directions.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-ink-800 border border-saffron-500/30 flex items-center justify-center text-saffron-400 text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-sm text-parchment-200 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Navigator;
