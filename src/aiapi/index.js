import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import fetch from "node-fetch";

// Load .env relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use gemini-2.5-flash as the default - it's stable, fast, and widely available
const modelName = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);

console.log("GEMINI_KEY_LEN:", process.env.GEMINI_API_KEY?.trim().length || 0);
console.log("Using model:", modelName);

// Test route
app.get("/", (req, res) => res.send("✅ Backend is live!"));

// Body logging middleware
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url, "Content-Type:", req.headers["content-type"]);
  try {
    console.log("Parsed body:", req.body && (Array.isArray(req.body) ? `array(${req.body.length})` : Object.keys(req.body).length ? "[keys]" : "{}"));
  } catch {}
  next();
});

// Generate recipes route using REST directly
app.post("/generate-recipes", async (req, res) => {
  try {
    let items;
    const body = req.body;

    if (!body) items = undefined;
    else if (Array.isArray(body.items)) items = body.items;
    else if (body.items && typeof body.items === "string") {
      try {
        const parsed = JSON.parse(body.items);
        items = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        items = body.items.split(",").map(s => s.trim()).filter(Boolean);
      }
    } else items = body.items;

    if (!items || !items.length) {
      return res.status(400).json({
        error: "No items provided",
        hint: 'Send JSON with Content-Type: application/json and a top-level items array, e.g. {"items":["milk","eggs"]}',
      });
    }

    const prompt = `You are a cooking assistant helping people reduce food waste. Suggest 3 simple recipes using these ingredients: ${items.join(", ")}. For each recipe, include:
- Recipe title
- List of ingredients needed
- Step-by-step instructions
- Disclaimer: Try maximizing the items in the list but avoid creating odd recipes like banana and onion milkshake. If this happens, make one recipe for the onion stuff and one recipe for banana stuff. This is just an example.
- Don't add any extra sentences in the beginning, only print out the 3 recipes with steps/ingredients. 
- Still keep it very user friendly and nice to read/look at. 

Keep recipes simple and practical.`;

    // Fallback if API key missing
    if (!hasGeminiKey) {
      const fallback = items.map((it, i) => `${i + 1}. Quick ${it} dish:\nIngredients: ${it}\nSteps: Mix and cook.`).join("\n\n");
      return res.json({ recipes: `FALLBACK (no GEMINI_API_KEY):\n\n${fallback}` });
    }

    // Fixed REST call to Gemini API
    // Try v1beta with generateContent - this works for most API keys
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    console.log("Calling Gemini API...");
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const responseText = await r.text();
    console.log("Response status:", r.status);
    console.log("Response text:", responseText.substring(0, 200));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      return res.status(500).json({ 
        error: "Failed to parse Gemini response", 
        details: responseText.substring(0, 500) 
      });
    }

    if (!r.ok) {
      console.error("Gemini REST error:", JSON.stringify(data));
      return res.status(500).json({ error: "Failed to generate recipes", details: data });
    }

    // Extract text from response - fixed path
    let recipes = "No recipes generated";
    if (data?.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate?.content?.parts && candidate.content.parts.length > 0) {
        recipes = candidate.content.parts[0].text;
      }
    }

    res.json({ recipes });
  } catch (error) {
    console.error("Error in /generate-recipes:", error?.message || error, error?.stack || "");
    res.status(500).json({ error: "Failed to generate recipes", details: error?.message || String(error) });
  }
});

// Start server
const PORT = 5001;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));