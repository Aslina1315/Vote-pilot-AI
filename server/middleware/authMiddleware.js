/**
 * Firebase Auth Middleware
 * Verifies Firebase ID tokens on protected backend routes.
 * Falls back to sessionId header for non-auth flows.
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin only once
let adminInitialized = false;

const initAdmin = () => {
  if (adminInitialized) return;
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId:    process.env.FIREBASE_PROJECT_ID,
        clientEmail:  process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in the private key env var
        privateKey:   (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
    adminInitialized = true;
  } catch (err) {
    console.warn('[Firebase Admin] Init skipped (missing credentials):', err.message);
  }
};

/**
 * Middleware: verifies Firebase token if present.
 * Non-blocking — sets req.uid if valid, otherwise falls back to sessionId header.
 */
const verifyFirebaseToken = async (req, res, next) => {
  initAdmin();

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token && adminInitialized) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.uid = decoded.uid;
      req.userEmail = decoded.email;
    } catch {
      // Invalid token — fall through to sessionId
    }
  }

  // Fallback: use x-session-id header (set by axios interceptor)
  if (!req.uid) {
    req.uid = req.headers['x-session-id'] || null;
  }

  next();
};

/**
 * Middleware: requires a verified Firebase token.
 * Returns 401 if no valid token is present.
 */
const requireAuth = async (req, res, next) => {
  await verifyFirebaseToken(req, res, () => {});
  if (!req.uid) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  next();
};

module.exports = { verifyFirebaseToken, requireAuth };
