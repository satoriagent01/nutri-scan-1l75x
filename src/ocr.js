/**
 * OCR extraction module that calls OpenAI-compatible endpoint
 * to extract nutrition data from product images.
 */

/**
 * Extracts nutritional information from a product image using an AI endpoint.
 *
 * @param {string} imageData - Base64-encoded image data or URL
 * @param {Object} config - Configuration object
 * @param {string} config.endpoint - The OpenAI-compatible API endpoint URL
 * @param {string} config.key - The API key for authentication
 * @param {string} [config.model] - The model to use (default: "gpt-4o")
 * @param {Function} [config.fetch] - Custom fetch function for testing
 * @returns {Promise<OCRResult>} A promise that resolves to an OCRResult object
 *
 * @typedef {Object} OCRResult
 * @property {string} productName - Name of the product
 * @property {Object} nutrients - Nutritional information per serving
 * @property {Object} nutrients.energy - Energy info
 * @property {number} nutrients.energy.value - Value
 * @property {string} nutrients.energy.unit - Unit (e.g., "kcal")
 * @property {string} nutrients.energy.per - Per what (e.g., "100g")
 * @property {Object} [nutrients.fat] - Fat info
 * @property {Object} [nutrients.saturatedFat] - Saturated fat info
 * @property {Object} [nutrients.carbohydrates] - Carbohydrates info
 * @property {Object} [nutrients.sugars] - Sugars info
 * @property {Object} [nutrients.fiber] - Fiber info
 * @property {Object} [nutrients.protein] - Protein info
 * @property {Object} [nutrients.sodium] - Sodium info
 */
export async function extractNutrition(imageData, config) {
  const { endpoint, key, model = "gpt-4o", fetch: customFetch } = config;
  const fetchFn = customFetch || fetch;

  const response = await fetchFn(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Extract the nutritional information from this product label. Return a JSON object with the following structure: { \"productName\": \"string\", \"nutrients\": { \"energy\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"fat\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"saturatedFat\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"carbohydrates\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"sugars\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"fiber\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"protein\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" }, \"sodium\": { \"value\": number, \"unit\": \"string\", \"per\": \"string\" } } }",
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageData}` },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}