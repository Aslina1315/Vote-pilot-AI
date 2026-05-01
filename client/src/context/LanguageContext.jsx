/**
 * LanguageContext
 * Provides language toggle across the entire app for all 22 scheduled Indian languages + English.
 * Stores preference in localStorage for persistence.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English', script: 'Latin' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी (Hindi)', script: 'Devanagari' },
  { code: 'bn', flag: '🇮🇳', name: 'বাংলা (Bengali)', script: 'Bengali' },
  { code: 'te', flag: '🇮🇳', name: 'తెలుగు (Telugu)', script: 'Telugu' },
  { code: 'mr', flag: '🇮🇳', name: 'मराठी (Marathi)', script: 'Devanagari' },
  { code: 'ta', flag: '🇮🇳', name: 'தமிழ் (Tamil)', script: 'Tamil' },
  { code: 'ur', flag: '🇮🇳', name: 'اردو (Urdu)', script: 'Arabic' },
  { code: 'gu', flag: '🇮🇳', name: 'ગુજરાતી (Gujarati)', script: 'Gujarati' },
  { code: 'kn', flag: '🇮🇳', name: 'ಕನ್ನಡ (Kannada)', script: 'Kannada' },
  { code: 'or', flag: '🇮🇳', name: 'ଓଡ଼ିଆ (Odia)', script: 'Odia' },
  { code: 'ml', flag: '🇮🇳', name: 'മലയാളം (Malayalam)', script: 'Malayalam' },
  { code: 'pa', flag: '🇮🇳', name: 'ਪੰਜਾਬੀ (Punjabi)', script: 'Gurmukhi' },
  { code: 'as', flag: '🇮🇳', name: 'অসমীয়া (Assamese)', script: 'Bengali' },
  { code: 'mai', flag: '🇮🇳', name: 'मैथिली (Maithili)', script: 'Devanagari' },
  { code: 'sat', flag: '🇮🇳', name: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)', script: 'Ol Chiki' },
  { code: 'ks', flag: '🇮🇳', name: 'कॉशुर (Kashmiri)', script: 'Arabic' },
  { code: 'ne', flag: '🇮🇳', name: 'नेपाली (Nepali)', script: 'Devanagari' },
  { code: 'kok', flag: '🇮🇳', name: 'कोंकणी (Konkani)', script: 'Devanagari' },
  { code: 'sd', flag: '🇮🇳', name: 'سنڌي (Sindhi)', script: 'Arabic' },
  { code: 'doi', flag: '🇮🇳', name: 'डोगरी (Dogri)', script: 'Devanagari' },
  { code: 'mni', flag: '🇮🇳', name: 'মৈতৈলোন্ (Manipuri)', script: 'Bengali' },
  { code: 'brx', flag: '🇮🇳', name: 'बड़ो (Bodo)', script: 'Devanagari' },
  { code: 'sa', flag: '🇮🇳', name: 'संस्कृतम् (Sanskrit)', script: 'Devanagari' }
];

// Fallback translations map. In a production app, use an i18n library (e.g. i18next)
// and fetch locale files asynchronously.
const translations = {
  en: {
    home: 'Home', assistant: 'AI Assistant', journey: 'My Journey', simulation: 'Voting Sim',
    readiness: 'Readiness', dashboard: 'Impact Dashboard', settings: 'Settings', navigator: 'Polling Navigator',
    getStarted: 'Get Started', eci: 'Election Commission of India'
  },
  ta: {
    home: 'முகப்பு', assistant: 'AI உதவியாளர்', journey: 'என் பயணம்', simulation: 'வாக்குச் சிமுலேஷன்',
    readiness: 'தயார்நிலை', dashboard: 'தாக்க டாஷ்போர்டு', settings: 'அமைப்புகள்', navigator: 'வாக்குச்சாவடி வழிசெலுத்தி',
    getStarted: 'தொடங்குங்கள்', eci: 'இந்திய தேர்தல் ஆணையம்'
  },
  hi: {
    home: 'होम', assistant: 'AI सहायक', journey: 'मेरी यात्रा', simulation: 'मतदान सिमुलेशन',
    readiness: 'तैयारी', dashboard: 'प्रभाव डैशबोर्ड', settings: 'सेटिंग्स', navigator: 'मतदान नेविगेटर',
    getStarted: 'शुरू करें', eci: 'भारत निर्वाचन आयोग'
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const stored = localStorage.getItem('vp_language') || 'en';
  const [language, setLanguageState] = useState(stored);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem('vp_language', lang);
  }, []);

  const t = useCallback((key) => {
    // If exact language match is missing, fallback to English.
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
