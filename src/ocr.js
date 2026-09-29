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
 * @property {number} nutrients.energy.value - Energy value
 * @property {string} nutrients.energy.unit - Energy unit (e.g., "kcal", "kJ")
 * @property {string} nutrients.energy.per - Per what (e.g., "100g")
 * @property {Object} nutrients.fat - Fat info
 * @property {number} nutrients.fat.value - Fat value
 * @property {string} nutrients.fat.unit - Fat unit
 * @property {string} nutrients.fat.per - Per what
 * @property {Object} nutrients.saturatedFat - Saturated fat info
 * @property {number} nutrients.saturatedFat.value - Saturated fat value
 * @property {string} nutrients.saturatedFat.unit - Unit
 * @property {string} nutrients.saturatedFat.per - Per what
 * @property {Object} nutrients.carbohydrates - Carbohydrates info
 * @property {number} nutrients.carbohydrates.value - Carbohydrates value
 * @property {string} nutrients.carbohydrates.unit - Unit
 * @property {string} nutrients.carbohydrates.per - Per what
 * @property {Object} nutrients.sugars - Sugars info
 * @property {number} nutrients.sugars.value - Sugars value
 * @property {string} nutrients.sugars.unit - Unit
 * @property {string} nutrients.sugars.per - Per what
 * @property {Object} nutrients.fiber - Fiber info
 * @property {number} nutrients.fiber.value - Fiber value
 * @property {string} nutrients.fiber.unit - Unit
 * @property {string} nutrients.fiber.per - Per what
 * @property {Object} nutrients.protein - Protein info
 * @property {number} nutrients.protein.value - Protein value
 * @property {string} nutrients.protein.unit - Unit
 * @property {string} nutrients.protein.per - Per what
 * @property {Object} nutrients.sodium - Sodium info
 * @property {number} nutrients.sodium.value - Sodium value
 * @property {string} nutrients.sodium.unit - Unit
 * @property {string} nutrients.sodium.per - Per what
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
              text: "Extract the nutritional information from this product label. Return a JSON object with the following structure: { \"productName\": string, \"nutrients\": { \"energy\": { \"value\": number, \"unit\": string, \"per\": string }, \"fat\": { \"value\": number, \"unit\": string, \"per\": string }, \"saturatedFat\": { \"value\": number, \"unit\": string, \"per\": string }, \"carbohydrates\": { \"value\": number, \"unit\": string, \"per\": string }, \"sugars\": { \"value\": number, \"unit\": string, \"per\": string }, \"fiber\": { \"value\": number, \"unit\": string, \"per\": string }, \"protein\": { \"value\": number, \"unit\": string, \"per\": string }, \"sodium\": { \"value\": number, \"unit\": string, \"per\": string } } }. All nutrient values should be per serving.",
            },
            {
              type: "image_url",
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
  let content = data.choices?.[0]?.message?.content || "";

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
    productName: result.productName || "Unknown Product",
    nutrients: {
      energy: {
        value: Number(result.nutrients?.energy?.value) || 0,
        unit: result.nutrients?.energy?.unit || "kcal",
        per: result.nutrients?.energy?.per || "100g",
      },
      fat: {
        value: Number(result.nutrients?.fat?.value) || 0,
        unit: result.nutrients?.fat?.unit || "g",
        per: result.nutrients?.fat?.per || "100g",
      },
      saturatedFat: {
        value: Number(result.nutrients?.saturatedFat?.value) || 0,
        unit: result.nutrients?.saturatedFat?.unit || "g",
        per: result.nutrients?.saturatedFat?.per || "100g",
      },
      carbohydrates: {
        value: Number(result.nutrients?.carbohydrates?.value) || 0,
        unit: result.nutrients?.carbohydrates?.unit || "g",
        per: result.nutrients?.carbohydrates?.per || "100g",
      },
      sugars: {
        value: Number(result.nutrients?.sugars?.value) || 0,
        unit: result.nutrients?.sugars?.unit || "g",
        per: result.nutrients?.sugars?.per || "100g",
      },
      fiber: {
        value: Number(result.nutrients?.fiber?.value) || 0,
        unit: result.nutrients?.fiber?.unit || "g",
        per: result.nutrients?.fiber?.per || "100g",
      },
      protein: {
        value: Number(result.nutrients?.protein?.value) || 0,
        unit: result.nutrients?.protein?.unit || "g",
        per: result.nutrients?.protein?.per || "100g",
      },
      sodium: {
        value: Number(result.nutrients?.sodium?.value) || 0,
        unit: result.nutrients?.sodium?.unit || "g",
        per: result.nutrients?.sodium?.per || "100g",
      },
    },
  };

  return normalizedResult;
}