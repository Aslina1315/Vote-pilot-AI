const admin = require('firebase-admin');

try {
  admin.credential.cert({
    projectId: undefined,
    clientEmail: undefined,
    privateKey: "",
  });
  console.log('Firebase cert success');
} catch (err) {
  console.error('Firebase cert failed:', err.message);
}
