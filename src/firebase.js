// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
// TODO: Replace with your actual Firebase project configuration from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if Firebase is properly configured
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

// Development mode: Use mock database for testing without Firebase
const USE_MOCK_DB = !isConfigured; // Automatically use mock if not configured

let app;
let db;

if (isConfigured) {
  // Initialize Firebase with real configuration
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} else {
  // Use mock database for development
  console.log('🔧 Using MOCK DATABASE for development');
  console.log('📝 All published designs will be stored in browser memory');
  console.log('ℹ️  Data will be lost on page refresh (that\'s okay for testing!)');
  console.log('🚀 You can publish and view designs without any Firebase setup');
  
  db = 'MOCK_DB'; // Just a flag for the helper functions
}

export { db, isConfigured, USE_MOCK_DB };
