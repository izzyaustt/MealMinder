import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore'; // Added setLogLevel for optional debugging

// --- Global Variable Access (MANDATORY for this environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-foodwaste-app';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
export const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Initialize Firebase
let app;
let auth;
let db;

if (Object.keys(firebaseConfig).length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // 1. SUCCESS MESSAGE
    console.log("✅ CONFIG SUCCESS: Firebase services initialized and available.");
    
    // Optional: Enable detailed Firestore logging for debugging
    setLogLevel('debug');

  } catch (error) {
    // 2. FAILURE MESSAGE
    console.error("❌ CONFIG FAILURE: Firebase Initialization Error!", error);
  }
} else {
  console.warn("⚠️ CONFIG WARNING: Firebase config not available. Database functions will not work.");
}

export { auth, db, appId };