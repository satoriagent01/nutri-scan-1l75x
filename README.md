# NutriScan

A free, ad-free nutritional label scanner and meal planner. Take photos of food packaging nutrition labels, extract the data using AI, and track your daily intake of calories, sodium, saturated fats, and more.

## Features

- **📷 Photo Scanning**: Take or upload photos of nutritional labels from food packaging
- **🤖 AI-Powered OCR**: Extracts nutritional information using an OpenAI-compatible API
- **📦 Product Library**: Save scanned products for quick reference
- **🍽️ Meal Planning**: Create meals and add products with custom serving sizes
- **📊 Nutrient Tracking**: See total nutrients for each meal (calories, fat, carbs, protein, sodium, etc.)
- **📅 Meal Plans**: Save and organize meal plans by day or week
- **💾 Local Storage**: All data stored locally in your browser — no account needed

## How to Run

### Prerequisites

- A modern web browser
- An OpenAI-compatible API endpoint (see Configuration below)

### Setup

1. Open `public/index.html` in a web browser
2. Go to the **Config** tab and enter your API endpoint URL and API key
3. Start scanning!

### Running Locally

You can serve the app with any static file server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js (with http-server)
npx http-server public -p 8080
```

Then open `http://localhost:8080` in your browser.

## Configuration

### AI Endpoint

NutriScan uses an OpenAI-compatible API to extract nutritional information from images. You need to provide:

- **API Endpoint URL**: The base URL of your OpenAI-compatible endpoint (e.g., `https://api.openai.com/v1`)
- **API Key**: Your API key for the endpoint

The app sends the image as base64 data to the endpoint's chat completions endpoint with a prompt that instructs the model to extract nutritional information in a structured format.

### Supported Endpoints

- OpenAI (`https://api.openai.com/v1`)
- Any OpenAI-compatible API (e.g., local models via Ollama, vLLM, etc.)

## How to Test

Run the test suite with:

```bash
npm test
```

The tests cover:

- OCR extraction from images
- Product creation and nutrient calculation
- Meal creation and item addition
- Meal plan creation and tracking
- Storage operations

## Data Model

### Product

- `id`: Unique identifier
- `name`: Product name
- `nutrients`: Nutrient values per serving (energy, fat, saturatedFat, carbohydrates, sugars, fiber, protein, sodium)
- `servingSize`: Amount of one serving
- `servingUnit`: Unit of measurement (e.g., "g")

### Meal

- `id`: Unique identifier
- `name`: Meal name
- `date`: Date of the meal
- `items`: Array of meal items (product reference + amount)

### Meal Plan

- `name`: Plan name
- `meals`: Array of meals

## What's Not Done Yet

- **Barcode scanning**: No support for scanning barcodes to look up products
- **Cloud sync**: Data is stored locally only; no cloud backup or sync
- **Nutritional goals**: No ability to set daily targets for nutrients
- **Recipe support**: No support for creating recipes with multiple ingredients
- **Mobile app**: Web-only; no native iOS/Android app
- **Offline AI**: Requires an internet connection for OCR; no local model support
- **Multiple languages**: UI is in English only; OCR works with multilingual labels but the UI doesn't translate

## License

Free and open source. No ads, no tracking, no data collection.