import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { auth, db, appId, initialAuthToken } from './config';

/**
 * Custom hook to handle Firebase Auth and fetch real-time inventory data.
 * @returns {{inventory: Array, userId: string | null, isAuthReady: boolean}}
 */
export function useInventoryData() {
  const [inventory, setInventory] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  // --- Authentication Setup (Runs once) ---
  useEffect(() => {
    if (!auth) return;

    // Set up the listener for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User signed in (via token or anonymously)
        setUserId(user.uid);
        setIsAuthReady(true);

        // ADD THIS LOG
    console.log(`AUTH SUCCESS: User is ready. UID: ${user.uid.substring(0, 8)}...`);
    
      } else {
        // No user, attempt to sign in
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Firebase Auth Error, defaulting to temp ID:", error);
          // Fallback: Use a temporary unique ID if auth fails
          setUserId(crypto.randomUUID()); 
          setIsAuthReady(true);
        }
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, [auth]); // Depends only on the 'auth' instance being ready

  // --- Real-Time Data Listener (Runs when userId is known) ---
  useEffect(() => {
    // Only proceed if DB is initialized and we have a valid userId
    if (!db || !userId || !isAuthReady) return;

    // Construct the secure, private collection path
    const inventoryPath = `/artifacts/${appId}/users/${userId}/inventory`;
    const q = query(collection(db, inventoryPath));

    // Set up the real-time snapshot listener
    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        // Convert Firestore Timestamp to JS Date for easier handling in React
        expiryDate: doc.data().expiryDate?.toDate ? doc.data().expiryDate.toDate() : doc.data().expiryDate,
        ...doc.data()
      }));
      setInventory(items);
      console.log(`Inventory fetched for user ${userId.substring(0, 8)}...`);
    }, (error) => {
      console.error("Firestore Snapshot Error:", error);
    });

    return () => unsubscribeSnapshot(); // Cleanup data listener
    
  }, [db, userId, isAuthReady]); // Re-runs if db or userId changes

  return { inventory, userId, isAuthReady };
}
