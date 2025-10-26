# MealMinder Setup Instructions

## Environment Variables Setup

### Backend Server (.env file)
Create a `.env` file in the `server/` directory with the following variables:

```env
# Google Gemini API Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3002

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env file)
Create a `.env` file in the root `MealMinder/` directory with:

```env
# Backend URL
REACT_APP_BACKENDURL=http://localhost:3002
```

## Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your server `.env` file as `GEMINI_API_KEY`

## Installation and Running

### Backend Server
```bash
cd server
npm install
npm start
```

### Frontend
```bash
cd MealMinder
npm install
npm start
```

## How It Works

1. User uploads a receipt photo in Upload2.js
2. Backend processes the image with OCR (Tesseract.js)
3. Extracted text is sent to Google Gemini API
4. Gemini extracts food items with quantities and expiry dates
5. Food items are displayed in a formatted list
6. Data structure matches Fridge.js expectations for future integration

## Features

- **OCR Processing**: Uses Tesseract.js for text extraction from receipt images
- **AI Food Extraction**: Google Gemini API intelligently identifies food items
- **Smart Expiry Calculation**: Automatically calculates expiry dates based on food type
- **Responsive UI**: Clean, modern interface for displaying extracted items
- **Error Handling**: Comprehensive error handling and user feedback
