/**
 * Product creation and nutrient calculation module.
 */

/**
 * Creates a product with nutritional information.
 *
 * @param {string} name - Product name
 * @param {Object} nutrients - Nutritional information per serving
 * @param {number} nutrients.energy - Energy in kJ
 * @param {number} nutrients.fat - Fat in grams
 * @param {number} nutrients.saturatedFat - Saturated fat in grams
 * @param {number} nutrients.carbohydrates - Carbohydrates in grams
 * @param {number} nutrients.sugars - Sugars in grams
 * @param {number} nutrients.fiber - Fiber in grams
 * @param {number} nutrients.protein - Protein in grams
 * @param {number} nutrients.sodium - Sodium in mg
 * @param {number} servingSize - Serving size amount
 * @param {string} servingUnit - Serving size unit (e.g., "g", "ml")
 * @returns {Product} A product object
 *
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} name - Product name
 * @property {Object} nutrients - Nutritional information per serving
 * @property {number} nutrients.energy - Energy in kJ
 * @property {number} nutrients.fat - Fat in grams
 * @property {number} nutrients.saturatedFat - Saturated fat in grams
 * @property {number} nutrients.carbohydrates - Carbohydrates in grams
 * @property {number} nutrients.sugars - Sugars in grams
 * @property {number} nutrients.fiber - Fiber in grams
 * @property {number} nutrients.protein - Protein in grams
 * @property {number} nutrients.sodium - Sodium in mg
 * @property {number} servingSize - Serving size amount
 * @property {string} servingUnit - Serving size unit
 */
let productIdCounter = 0;

export function createProduct(name, nutrients, servingSize, servingUnit) {
  productIdCounter += 1;
  return {
    id: `product-${productIdCounter}`,
    name,
    nutrients: {
      energy: Number(nutrients.energy) || 0,
      fat: Number(nutrients.fat) || 0,
      saturatedFat: Number(nutrients.saturatedFat) || 0,
      carbohydrates: Number(nutrients.carbohydrates) || 0,
      sugars: Number(nutrients.sugars) || 0,
      fiber: Number(nutrients.fiber) || 0,
      protein: Number(nutrients.protein) || 0,
      sodium: Number(nutrients.sodium) || 0,
    },
    servingSize: Number(servingSize) || 100,
    servingUnit: servingUnit || 'g',
  };
}

/**
 * Calculates the nutritional values for a given amount of a product.
 *
 * @param {Product} product - The product object
 * @param {number} amount - Amount in grams (or the serving unit)
 * @returns {NutrientMap} Nutrient values for the given amount
 *
 * @typedef {Object} NutrientMap
 * @property {number} energy - Energy in kJ
 * @property {number} fat - Fat in grams
 * @property {number} saturatedFat - Saturated fat in grams
 * @property {number} carbohydrates - Carbohydrates in grams
 * @property {number} sugars - Sugars in grams
 * @property {number} fiber - Fiber in grams
 * @property {number} protein - Protein in grams
 * @property {number} sodium - Sodium in mg
 */
export function calculateNutrients(product, amount) {
  const ratio = amount / product.servingSize;

  return {
    energy: product.nutrients.energy * ratio,
    fat: product.nutrients.fat * ratio,
    saturatedFat: product.nutrients.saturatedFat * ratio,
    carbohydrates: product.nutrients.carbohydrates * ratio,
    sugars: product.nutrients.sugars * ratio,
    fiber: product.nutrients.fiber * ratio,
    protein: product.nutrients.protein * ratio,
    sodium: product.nutrients.sodium * ratio,
  };
}