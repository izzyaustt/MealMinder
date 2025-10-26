// server/aiapi/index.js - Complete API routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { extractFoodItems } = require('./geminiExtractor');
const fs = require('fs').promises;
const path = require('path');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Extract text from receipt image using Google Vision API
 */
async function extractTextFromImage(imagePath) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Read image file
    const imageData = await fs.readFile(imagePath);
    const base64Image = imageData.toString('base64');

    const prompt = `
Extract ALL text from this receipt image. Return the data as a JSON array where each line item is an object with:
- "name": the text/item name
- "purchased": today's date in format "YYYY-MM-DD"

Include everything visible: dates, items, prices, totals, etc.
Return ONLY valid JSON, no additional text.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const response = await result.response;
    let responseText = response.text().trim();

    // Clean up markdown code blocks
    if (responseText.startsWith('```')) {
      const parts = responseText.split('```');
      responseText = parts[1] || parts[0];
      responseText = responseText.replace(/^json\s*/i, '').trim();
    }

    const extractedData = JSON.parse(responseText);
    return extractedData;

  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw error;
  }
}

/**
 * POST /api/process-receipt
 * Complete flow: Upload image → Extract text → Extract food items
 * 
 * Expects: multipart/form-data with 'receipt' file
 * Returns: { success, receiptData, foodItems }
 */
router.post('/process-receipt', upload.single('receipt'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No receipt image uploaded'
      });
    }

    filePath = req.file.path;

    // Step 1: Extract text from image
    console.log('Step 1: Extracting text from receipt image...');
    const receiptData = await extractTextFromImage(filePath);

    // Step 2: Extract food items from receipt data
    console.log('Step 2: Extracting food items...');
    const foodItems = await extractFoodItems(receiptData);

    // Clean up uploaded file
    await fs.unlink(filePath);

    return res.status(200).json({
      success: true,
      receiptData: receiptData,
      foodItems: foodItems,
      totalItems: foodItems.length
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    
    // Clean up file if it exists
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process receipt'
    });
  }
});

/**
 * POST /api/extract-food
 * Extract food items from already-extracted receipt data
 * 
 * Request body: { receiptData: [...] }
 */
router.post('/extract-food', async (req, res) => {
  try {
    const { receiptData } = req.body;

    if (!receiptData) {
      return res.status(400).json({
        success: false,
        error: 'Receipt data is required'
      });
    }

    const foodItems = await extractFoodItems(receiptData);

    return res.status(200).json({
      success: true,
      data: foodItems,
      count: foodItems.length
    });

  } catch (error) {
    console.error('Error in extract-food endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract food items'
    });
  }
});

/**
 * POST /api/extract-text
 * Extract text from receipt image only
 * 
 * Expects: multipart/form-data with 'receipt' file
 */
router.post('/extract-text', upload.single('receipt'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No receipt image uploaded'
      });
    }

    filePath = req.file.path;

    const receiptData = await extractTextFromImage(filePath);

    // Clean up uploaded file
    await fs.unlink(filePath);

    return res.status(200).json({
      success: true,
      data: receiptData,
      count: receiptData.length
    });

  } catch (error) {
    console.error('Error extracting text:', error);
    
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to extract text from receipt'
    });
  }
});

module.exports = router;