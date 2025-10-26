import express from "express";
import multer from "multer";
import cors from "cors";
import Tesseract from "tesseract.js";
import sharp from "sharp"; // Added sharp import
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = 3002;

// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// Google Gemini API configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key-here');

/**
 * Extract food items from receipt text using simple pattern matching
 */
function extractFoodItemsFromText(text) {
  const lines = text.split('\n');
  const foodItems = [];
  const currentDate = new Date();
  
  // Common food items and their typical shelf life in days
  const foodShelfLife = {
    'zucchini': 7, 'banana': 5, 'potatoes': 14, 'broccoli': 5, 'brussel sprouts': 7,
    'grapes': 7, 'peas': 3, 'tomatoes': 7, 'lettuce': 5, 'milk': 7, 'bread': 5,
    'eggs': 14, 'cheese': 14, 'yogurt': 7, 'meat': 3, 'fish': 2, 'apples': 14,
    'oranges': 14, 'carrots': 21, 'onions': 21, 'spinach': 5, 'cucumber': 7,
    'bell peppers': 7, 'berries': 3, 'citrus': 14
  };
  
  lines.forEach(line => {
    // Look for lines that contain food items (skip price lines, totals, etc.)
    if (line.includes('$') && !line.includes('SUBTOTAL') && !line.includes('TOTAL') && 
        !line.includes('CASH') && !line.includes('CHANGE') && !line.includes('LOYALTY')) {
      
      // Extract food name (everything before the $)
      const dollarIndex = line.indexOf('$');
      if (dollarIndex > 0) {
        let foodName = line.substring(0, dollarIndex).trim();
        
        // Clean up the food name - remove weight info that appears before the food name
        foodName = foodName.replace(/\d+\.\d+kg NET @ \$\d+\.\d+\/kg/, '').trim();
        foodName = foodName.replace(/^\d+/, '').trim(); // Remove leading numbers
        foodName = foodName.replace(/SPECIAL/, 'Unknown Item'); // Handle special items
        
        // Additional cleanup for common OCR errors
        foodName = foodName.replace(/IUCHINNI/, 'ZUCCHINI');
        foodName = foodName.replace(/BRUSSEL/, 'BRUSSELS');
        
        // Filter out non-food items (weight info, numbers, etc.)
        const isNotFood = /^[\d\.\s@\/kg]+$/.test(foodName) || 
                         foodName.includes('kg NET @') || 
                         foodName.includes('@ $') ||
                         foodName.length < 3 ||
                         /^\d+$/.test(foodName) ||
                         foodName === 'Unknown Item';
        
        if (foodName && !isNotFood) {
          // Determine quantity (look for weight or assume 1)
          let quantity = 1;
          const weightMatch = line.match(/(\d+\.\d+)kg/);
          if (weightMatch) {
            quantity = Math.ceil(parseFloat(weightMatch[1]));
          }
          
          // Calculate expiry date
          const shelfLife = Object.keys(foodShelfLife).find(key => 
            foodName.toLowerCase().includes(key)
          );
          const daysToAdd = shelfLife ? foodShelfLife[shelfLife] : 7; // Default 7 days
          const expiryDate = new Date(currentDate);
          expiryDate.setDate(currentDate.getDate() + daysToAdd);
          
          foodItems.push({
            name: foodName,
            quantity: quantity,
            expiryDate: expiryDate.toISOString().split('T')[0]
          });
        }
      }
    }
  });
  
  return foodItems;
}

/**
 * Extract food items from receipt text using Google Gemini API
 */
async function extractFoodItems(receiptText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a food item extractor. Given receipt text, extract ONLY food items and create a JSON array.

For each food item, provide:
1. name (string): Clean, readable name of the food item
2. quantity (integer): Number of items purchased (default to 1 if unclear)
3. expiryDate (string): Calculate expiry date as YYYY-MM-DD format based on current date + estimated days until spoilage

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
- Milk: 7 days
- Eggs: 14 days
- Cheese: 14 days
- Yogurt: 7 days
- Bread: 5 days
- Meat: 3 days
- Fish: 2 days

Current date: ${new Date().toISOString().split('T')[0]}

Ignore:
- Dates, timestamps, barcodes
- Price information, subtotals, totals
- Payment information (cash, change, card)
- Loyalty discounts or promotions
- Non-food items

Receipt text:
${receiptText}

Return ONLY a valid JSON array with no additional text, markdown formatting, or explanation.
`;

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

// Upload route
app.post("/test", upload.single("receipt"), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Preprocess the image
        const preprocessedImagePath = `${filePath}-processed.png`;
        await sharp(filePath)
            .grayscale()
            .normalize()
            .threshold(128) // <--- Add Thresholding (binary conversion)
            .resize(2000) // <--- Increase Resolution (improves small text reading)
            .toFile(preprocessedImagePath);

        // Perform OCR using Tesseract.js
        const { data: { text } } = await Tesseract.recognize(preprocessedImagePath, "eng", {
            logger: (info) => console.log(info), // Log OCR progress
        });

        console.log("OCR extracted text:", text);

        // Extract food items from the OCR text using simple pattern matching
        const foodItems = extractFoodItemsFromText(text);
        
        // Add unique IDs to each item for React key prop
        const itemsWithIds = foodItems.map((item, index) => ({
            id: Date.now() + index,
            name: item.name,
            quantity: item.quantity || 1,
            expiryDate: item.expiryDate
        }));

        console.log("Extracted food items:", itemsWithIds);

        res.json({
            success: true,
            message: "Food items extracted successfully",
            foodItems: itemsWithIds,
            rawText: text // Include raw text for debugging
        });
    } catch (error) {
        console.error("Processing error:", error);
        res.status(500).json({
            success: false,
            error: "An error occurred during receipt processing",
            details: error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});