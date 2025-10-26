// Frontend Firebase configuration
import { auth, db } from '../Firebase.jsx';

// App ID for Firestore collection paths
export const appId = 'mealminder-app';

// Initial auth token (can be null for anonymous auth)
export const initialAuthToken = null;

// Re-export Firebase instances
export { auth, db };
