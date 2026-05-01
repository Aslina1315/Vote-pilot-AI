/**
 * Firebase Configuration
 * Initializes Firebase app for Authentication only.
 * All sensitive API keys are pulled from environment variables.
 * The Gemini AI key remains exclusively on the backend.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

// Firebase project config — values come from .env (REACT_APP_ prefix required by CRA)
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// Check if Firebase is actually configured
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.startsWith('your_')
);

let app = null;
export let auth = null;
export const isConfigured = isFirebaseConfigured;

// Only initialize Firebase when real credentials are present
if (isFirebaseConfigured) {
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export default app;

// Google OAuth provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ─── Auth Helpers ─────────────────────────────────────────────────────────────

/** Sign in with Google popup */
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

/** Register with email + password */
export const registerWithEmail = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred;
};

/** Sign in with email + password */
export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/** Send password reset email */
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

/** Sign out current user */
export const logout = () => signOut(auth);



