// Client-side Firebase initialization
// Populate the REACT_APP_... environment variables in your .env file
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Prefer explicit env variables (REACT_APP_*) set in project root .env file.
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
if (!apiKey || apiKey === 'YOUR_API_KEY') {
  // Helpful console message for developers when the API key is missing or using the placeholder.
  // Note: create-react-app only exposes env vars prefixed with REACT_APP_ at build time.
  // Add a .env file in the project root with REACT_APP_FIREBASE_API_KEY and restart the dev server.
  // Example in .env.example included in the repo.
  console.error(
    'Firebase API key is missing or invalid. Set REACT_APP_FIREBASE_API_KEY in a .env file at the project root and restart the dev server.'
  );
}


const firebaseConfig = {
  apiKey: apiKey || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_AUTHORIZED_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: import.meta.env.VITE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
};
console.log(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
