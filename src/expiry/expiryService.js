import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the expiry database
const expiryData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'foodExpiryData.json'), 'utf8')
);

/**
 * Search for a food item in the database (case-insensitive, partial match)
 * @param {string} itemName - The name of the food item
 * @returns {object|null} - Expiry data or null if not found
 */
function findItemInDatabase(itemName) {
  const searchTerm = itemName.toLowerCase().trim();
  
  // Search through all categories
  for (const category of Object.values(expiryData)) {
    for (const [foodName, expiryInfo] of Object.entries(category)) {
      // Check for exact match or if search term is contained in food name
      if (foodName === searchTerm || 
          foodName.includes(searchTerm) || 
          searchTerm.includes(foodName)) {
        return {
          name: foodName,
          ...expiryInfo
        };
      }
    }
  }
  
  return null;
}

/**
 * Use Gemini to estimate expiry date for unknown items
 * @param {string} itemName - The name of the food item
 * @param {string} geminiApiKey - Gemini API key
 * @returns {object} - Estimated expiry data
 */
async function getExpiryFromGemini(itemName, geminiApiKey) {
  const prompt = `You are a food safety expert. For the food item "${itemName}", provide the typical shelf life in days. Consider refrigerated storage as default. Respond ONLY with a JSON object in this exact format (no markdown, no extra text):
{"days": <number>, "storage": "refrigerated", "note": "<brief storage tip>"}

Example: {"days": 7, "storage": "refrigerated", "note": "Keep sealed"}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text.trim();
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?|\n?```/g, '');
      const parsed = JSON.parse(cleanText);
      
      return {
        name: itemName,
        refrigerated: parsed.days,
        note: parsed.note,
        source: 'gemini'
      };
    }
  } catch (error) {
    console.error('Gemini API error:', error);
  }
  
  // Fallback default
  return {
    name: itemName,
    refrigerated: 7,
    note: 'Default estimate - store properly',
    source: 'default'
  };
}

/**
 * Calculate expiry date for a food item
 * @param {string} itemName - The name of the food item
 * @param {string} purchaseDate - ISO date string when item was purchased
 * @param {string} storageType - 'refrigerated', 'frozen', 'pantry', or 'counter'
 * @param {string} geminiApiKey - Optional Gemini API key for unknown items
 * @returns {object} - Expiry information
 */
export async function calculateExpiry(itemName, purchaseDate, storageType = 'refrigerated', geminiApiKey = null) {
  // Try to find in database first
  let itemData = findItemInDatabase(itemName);
  let source = 'database';
  
  // If not found and Gemini key provided, use AI
  if (!itemData && geminiApiKey) {
    itemData = await getExpiryFromGemini(itemName, geminiApiKey);
    source = itemData.source;
  }
  
  // Final fallback
  if (!itemData) {
    itemData = {
      name: itemName,
      refrigerated: 7,
      note: 'Default estimate',
      source: 'default'
    };
    source = 'default';
  }
  
  // Get shelf life based on storage type
  const shelfLife = itemData[storageType] || itemData.refrigerated || itemData.pantry || itemData.counter || 7;
  
  // Calculate expiry date
  const purchase = new Date(purchaseDate);
  const expiry = new Date(purchase);
  expiry.setDate(expiry.getDate() + shelfLife);
  
  // Calculate days until expiry
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  
  return {
    itemName: itemName,
    purchaseDate: purchaseDate,
    expiryDate: expiry.toISOString().split('T')[0],
    daysUntilExpiry: daysUntilExpiry,
    shelfLife: shelfLife,
    storageType: storageType,
    status: daysUntilExpiry < 0 ? 'expired' : daysUntilExpiry <= 2 ? 'urgent' : daysUntilExpiry <= 5 ? 'soon' : 'fresh',
    source: source
  };
}

/**
 * Calculate expiry for multiple items
 * @param {Array} items - Array of {name, purchaseDate, storageType}
 * @param {string} geminiApiKey - Optional Gemini API key
 * @returns {Array} - Array of expiry information objects
 */
export async function calculateMultipleExpiries(items, geminiApiKey = null) {
  const results = await Promise.all(
    items.map(item => 
      calculateExpiry(
        item.name, 
        item.purchaseDate, 
        item.storageType || 'refrigerated',
        geminiApiKey
      )
    )
  );
  
  return results;
}