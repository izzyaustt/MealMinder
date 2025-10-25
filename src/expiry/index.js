import express from 'express';
import { calculateExpiry, calculateMultipleExpiries } from './expiryService.js';

const router = express.Router();

/**
 * POST /expiry/calculate
 * Calculate expiry for a single item
 * Body: { name: string, purchaseDate: string, storageType?: string }
 */
router.post('/calculate', async (req, res) => {
  try {
    const { name, purchaseDate, storageType } = req.body;
    
    if (!name || !purchaseDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'purchaseDate']
      });
    }
    
    const geminiKey = process.env.GEMINI_API_KEY;
    const result = await calculateExpiry(name, purchaseDate, storageType, geminiKey);
    
    res.json(result);
  } catch (error) {
    console.error('Error calculating expiry:', error);
    res.status(500).json({
      error: 'Failed to calculate expiry',
      details: error.message
    });
  }
});

/**
 * POST /expiry/calculate-batch
 * Calculate expiry for multiple items
 * Body: { items: [{name, purchaseDate, storageType}] }
 */
router.post('/calculate-batch', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Invalid request',
        hint: 'Send an array of items with name and purchaseDate'
      });
    }
    
    const geminiKey = process.env.GEMINI_API_KEY;
    const results = await calculateMultipleExpiries(items, geminiKey);
    
    res.json({ items: results });
  } catch (error) {
    console.error('Error calculating batch expiry:', error);
    res.status(500).json({
      error: 'Failed to calculate expiries',
      details: error.message
    });
  }
});

/**
 * GET /expiry/urgent
 * Get items expiring soon from a list
 * Query: items (JSON array), days (number, default 2)
 */
router.post('/urgent', async (req, res) => {
  try {
    const { items, daysThreshold = 2 } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        error: 'Invalid request',
        hint: 'Send an array of items'
      });
    }
    
    const geminiKey = process.env.GEMINI_API_KEY;
    const results = await calculateMultipleExpiries(items, geminiKey);
    
    // Filter for urgent items
    const urgent = results.filter(item => 
      item.status === 'urgent' || item.status === 'expired'
    );
    
    res.json({
      urgent: urgent,
      total: results.length,
      urgentCount: urgent.length
    });
  } catch (error) {
    console.error('Error finding urgent items:', error);
    res.status(500).json({
      error: 'Failed to find urgent items',
      details: error.message
    });
  }
});

export default router;