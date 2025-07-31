require('dotenv').config();
const { initializeFirebase, isFirebaseInitialized } = require('./config/firebase');

console.log('🔍 Testing Firebase Configuration...\n');

// Check environment variables
const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID'
];

console.log('📋 Environment Variables Check:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('PRIVATE_KEY') ? 'Set (hidden)' : value}`);
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log('\n🔥 Testing Firebase Initialization...');

try {
  const firebaseApp = initializeFirebase();
  if (firebaseApp) {
    console.log('✅ Firebase Admin SDK initialized successfully!');
    console.log(`📊 Project ID: ${firebaseApp.options.projectId}`);
    console.log(`🔧 Service Account: ${firebaseApp.options.credential.clientEmail}`);
  } else {
    console.log('❌ Firebase Admin SDK initialization failed');
  }
} catch (error) {
  console.log('❌ Firebase Admin SDK initialization error:', error.message);
  
  if (error.message.includes('private key')) {
    console.log('\n💡 Private Key Format Issue Detected!');
    console.log('Make sure your FIREBASE_PRIVATE_KEY is:');
    console.log('1. Enclosed in double quotes');
    console.log('2. Has \\n instead of actual newlines');
    console.log('3. Includes the full private key content');
    console.log('\nExample:');
    console.log('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n"');
  }
}

console.log('\n📊 Firebase Status:', isFirebaseInitialized() ? '✅ Initialized' : '❌ Not configured'); 