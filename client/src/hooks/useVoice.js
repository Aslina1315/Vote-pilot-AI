/**
 * useVoice Hook
 * Wraps the Web Speech API for voice input and text-to-speech output.
 * Provides accessibility support for users who prefer voice interaction.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

const useVoice = ({ onTranscript, language = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition && !!window.speechSynthesis);
  }, []);

  /**
   * Starts voice recognition and captures transcript.
   * Calls onTranscript callback when speech ends.
   */
  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscriptRef.current = '';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const currentText = finalTranscriptRef.current + interimTranscript;
      if (currentText.trim()) {
        setTranscript(currentText.trim());
        if (onTranscript) onTranscript(currentText.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('[Voice] Recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, onTranscript]);

  /** Stops active voice recognition */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  /**
   * Reads text aloud using the Web Speech Synthesis API.
   * @param {string} text - Text to speak
   */
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;

    // Load available voices
    let voices = window.speechSynthesis.getVoices();
    
    // Sometimes voices aren't loaded immediately
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        playUtterance(text, voices);
      };
    } else {
      playUtterance(text, voices);
    }

    function playUtterance(textContent, availableVoices) {
      const utterance = new SpeechSynthesisUtterance(textContent);
      utterance.lang = language;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a voice that exactly matches the language code (e.g., 'ta-IN')
      let voice = availableVoices.find(v => v.lang === language || v.lang.replace('_', '-') === language);
      
      // Fallback 1: Try to match just the base language (e.g., 'ta')
      if (!voice) {
        const baseLang = language.split('-')[0];
        voice = availableVoices.find(v => v.lang.startsWith(baseLang));
      }
      
      // Fallback 2: Try Hindi (often has good cross-Indian script support on Windows/Android)
      if (!voice) {
        voice = availableVoices.find(v => v.lang.startsWith('hi'));
      }
      
      // Fallback 3: Try English India
      if (!voice) {
        voice = availableVoices.find(v => v.lang === 'en-IN');
      }

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend   = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('[Voice] Speech error:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  }, [language]);

  /** Cancels ongoing speech */
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
};

export default useVoice;
