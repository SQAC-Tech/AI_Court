const admin = require('firebase-admin');

// Firebase Admin SDK configuration
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

let firebaseApp = null;

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      firebaseApp = admin.apps[0];
      console.log('Firebase Admin SDK already initialized');
      return firebaseApp;
    }

    // Validate required environment variables
    const requiredEnvVars = [
      'FIREBASE_TYPE',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID',
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.warn('Missing Firebase environment variables:', missingVars);
      console.warn('Firebase Admin SDK will not be initialized');
      return null;
    }

    // Initialize Firebase Admin SDK
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
    return null;
  }
};

// Get Firebase Admin instance
const getFirebaseAdmin = () => {
  if (!firebaseApp) {
    firebaseApp = initializeFirebase();
  }
  return firebaseApp;
};

// Check if Firebase is initialized
const isFirebaseInitialized = () => {
  return firebaseApp !== null && admin.apps.length > 0;
};

module.exports = {
  initializeFirebase,
  getFirebaseAdmin,
  isFirebaseInitialized,
  admin
}; 