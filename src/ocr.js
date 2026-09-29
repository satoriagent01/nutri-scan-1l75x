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
 * @returns {Promise<OCRResult>} A promise that resolves to an OCRResult object
 *
 * @typedef {Object} OCRResult
 * @property {string} productName - Name of the product
 * @property {Object} servingSize - Serving size information
 * @property {number} servingSize.amount - Amount of the serving
 * @property {string} servingSize.unit - Unit of the serving (e.g., "g", "ml")
 * @property {Object} nutrients - Nutritional information per serving
 * @property {number} nutrients.energy - Energy in kJ
 * @property {number} nutrients.fat - Fat in grams
 * @property {number} nutrients.saturatedFat - Saturated fat in grams
 * @property {number} nutrients.carbohydrates - Carbohydrates in grams
 * @property {number} nutrients.sugars - Sugars in grams
 * @property {number} nutrients.fiber - Fiber in grams
 * @property {number} nutrients.protein - Protein in grams
 * @property {number} nutrients.sodium - Sodium in mg
 */
export async function extractNutrition(imageData, config) {
  const { endpoint, key } = config;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the nutritional information from this product label. Return a JSON object with the following structure: { "productName": string, "servingSize": { "amount": number, "unit": string }, "nutrients": { "energy": number, "fat": number, "saturatedFat": number, "carbohydrates": number, "sugars": number, "fiber": number, "protein": number, "sodium": number } }. All nutrient values should be per serving. Energy should be in kJ, fats/carbs/protein in grams, and sodium in mg.',
            },
            {
              type: 'image_url',
              image_url: { url: imageData },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OCR API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // Parse the response content as JSON
  let content = data.choices?.[0]?.message?.content || '';

  // Try to extract JSON from the response (handle markdown code blocks)
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    content = jsonMatch[1];
  }

  let result;
  try {
    result = JSON.parse(content);
  } catch (e) {
    throw new Error(`Failed to parse OCR response as JSON: ${content}`);
  }

  // Validate and normalize the result
  const normalizedResult = {
    productName: result.productName || 'Unknown Product',
    servingSize: {
      amount: Number(result.servingSize?.amount) || 100,
      unit: result.servingSize?.unit || 'g',
    },
    nutrients: {
      energy: Number(result.nutrients?.energy) || 0,
      fat: Number(result.nutrients?.fat) || 0,
      saturatedFat: Number(result.nutrients?.saturatedFat) || 0,
      carbohydrates: Number(result.nutrients?.carbohydrates) || 0,
      sugars: Number(result.nutrients?.sugars) || 0,
      fiber: Number(result.nutrients?.fiber) || 0,
      protein: Number(result.nutrients?.protein) || 0,
      sodium: Number(result.nutrients?.sodium) || 0,
    },
  };

  return normalizedResult;
}