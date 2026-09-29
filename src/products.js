/**
 * Product creation and nutrient calculation module.
 */

/**
 * Creates a product with nutritional information.
 *
 * @param {string} name - Product name
 * @param {Object} nutrients - Nutritional information per serving
 *   Each nutrient is an object with { value, unit, per }
 * @param {number} servingSize - Serving size amount
 * @param {string} servingUnit - Serving size unit (e.g., "g", "ml")
 * @returns {Product} A product object
 *
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {Object} nutrients - Nutritional information per serving (raw, with value/unit/per)
 * @property {number} servingSize - Serving size amount
 * @property {string} servingUnit - Serving size unit
 */
let productIdCounter = 0;

export function createProduct(name, nutrients, servingSize, servingUnit) {
  productIdCounter += 1;
  return {
    id: `product-${productIdCounter}`,
    name,
    nutrients,
    servingSize: Number(servingSize) || 100,
    servingUnit: servingUnit || 'g',
  };
}

/**
 * Calculates the nutritional values for a given amount of a product.
 *
 * @param {Product} product - The product object
 * @param {number} amount - Amount in the product's serving unit
 * @returns {NutrientMap} Nutrient values for the given amount
 *
 * @typedef {Object} NutrientMap
 * @property {number} energy - Energy value
 * @property {number} fat - Fat in grams
 * @property {number} saturatedFat - Saturated fat in grams
 * @property {number} carbohydrates - Carbohydrates in grams
 * @property {number} sugars - Sugars in grams
 * @property {number} fiber - Fiber in grams
 * @property {number} protein - Protein in grams
 * @property {number} sodium - Sodium value
 */
export function calculateNutrients(product, amount) {
  const ratio = amount / product.servingSize;

  return {
    energy: (product.nutrients.energy?.value ?? 0) * ratio,
    fat: (product.nutrients.fat?.value ?? 0) * ratio,
    saturatedFat: (product.nutrients.saturatedFat?.value ?? 0) * ratio,
    carbohydrates: (product.nutrients.carbohydrates?.value ?? 0) * ratio,
    sugars: (product.nutrients.sugars?.value ?? 0) * ratio,
    fiber: (product.nutrients.fiber?.value ?? 0) * ratio,
    protein: (product.nutrients.protein?.value ?? 0) * ratio,
    sodium: (product.nutrients.sodium?.value ?? 0) * ratio,
  };
}