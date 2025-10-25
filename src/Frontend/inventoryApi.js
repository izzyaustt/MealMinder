import { collection, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, appId } from './config';

/**
 * Adds or updates an inventory item in Firestore.
 * This is used when the OCR/Gemini service parses a receipt (Create).
 * @param {string} userId - The current user's unique ID.
 * @param {object} itemData - The item data, including itemName, quantity, and expiryDate (as a JS Date object).
 */
export async function addInventoryItem(userId, itemData) {
  if (!db || !userId) {
    console.error("Database or User ID not ready.");
    return;
  }

  // Mandatory private data path: /artifacts/{appId}/users/{userId}/inventory
  const collectionPath = `/artifacts/${appId}/users/${userId}/inventory`;
  
  // Create a document reference without an ID (Firestore generates one)
  const docRef = doc(collection(db, collectionPath));

  const newItem = {
    ...itemData,
    createdAt: serverTimestamp(), // Use server time for consistency
    // Note: JS Date objects (like itemData.expiryDate) are automatically converted to Firestore Timestamps.
  };

  try {
    await setDoc(docRef, newItem);
    console.log("Document successfully written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

/**
 * Deletes a specific inventory item (Delete).
 * @param {string} userId - The current user's unique ID.
 * @param {string} itemId - The ID of the document to delete.
 */
export async function deleteInventoryItem(userId, itemId) {
  if (!db || !userId) {
    console.error("Database or User ID not ready.");
    return;
  }

  // Mandatory private data path: /artifacts/{appId}/users/{userId}/inventory/{itemId}
  const docPath = `/artifacts/${appId}/users/${userId}/inventory`;
  const itemRef = doc(db, docPath, itemId);
  
  try {
    await deleteDoc(itemRef);
    console.log("Document successfully deleted.");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
}