// server/aiapi/geminiExtract.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Extract food items from receipt data using Google Gemini API
 * @param {Array|String} receiptData - Receipt data as array of objects or JSON string
 * @param {String} apiKey - Google Gemini API key (optional if set in env)
 * @returns {Promise<Array>} Array of food items with name, quantity, and spoilage days
 */
async function extractFoodItems(receiptData, apiKey = null) {
  try {
    // Get API key from parameter or environment variable
    const key = apiKey || process.env.GEMINI_API_KEY;
    
    if (!key) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert receipt data to string
    const receiptText = typeof receiptData === 'string' 
      ? receiptData 
      : JSON.stringify(receiptData, null, 2);

    // Create the prompt
    const prompt = `
You are a food item extractor. Given receipt data, extract ONLY food items and create a JSON array.

For each food item, provide:
1. food_name (string): Clean, readable name of the food item
2. quantity (integer): Number of items purchased (default to 1 if unclear)
3. days_until_spoilage (integer): Estimated days until the item goes bad when stored properly

Use these typical spoilage estimates for refrigerated storage:
- Bananas: 5 days
- Leafy greens (lettuce, spinach): 5 days
- Broccoli, cauliflower: 5 days
- Tomatoes: 7 days
- Zucchini, squash: 7 days
- Brussels sprouts: 7 days
- Grapes: 7 days
- Snow peas, snap peas: 3 days
- Bell peppers: 7 days
- Cucumbers: 7 days
- Potatoes: 14 days
- Onions: 21 days
- Carrots: 21 days
- Apples: 14 days
- Berries: 3 days
- Citrus fruits: 14 days

Ignore:
- Dates, timestamps, barcodes
- Price information, subtotals, totals
- Payment information (cash, change, card)
- Loyalty discounts or promotions
- Non-food items

Receipt data:
${receiptText}

Return ONLY a valid JSON array with no additional text, markdown formatting, or explanation.
`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text().trim();

    // Clean up response - remove markdown code blocks if present
    if (responseText.startsWith('```')) {
      const parts = responseText.split('```');
      responseText = parts[1] || parts[0];
      responseText = responseText.replace(/^json\s*/i, '').trim();
    }

    // Parse and return JSON
    const foodItems = JSON.parse(responseText);
    return foodItems;

  } catch (error) {
    console.error("Error extracting food items:", error);
    throw error;
  }
}

module.exports = { extractFoodItems };