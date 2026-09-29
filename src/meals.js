/**
 * Meal creation, item addition, and total calculation module.
 */

/**
 * Creates a meal with a name and date.
 *
 * @param {string} name - Meal name (e.g., "Breakfast", "Lunch")
 * @param {string} [date] - Date of the meal (ISO format string). Defaults to today.
 * @returns {Meal} A meal object
 *
 * @typedef {Object} Meal
 * @property {string} id - Unique meal identifier
 * @property {string} name - Meal name
 * @property {string} date - Date of the meal
 * @property {Array<MealItem>} items - List of items in the meal
 *
 * @typedef {Object} MealItem
 * @property {string} productId - ID of the product
 * @property {string} productName - Name of the product
 * @property {number} amount - Amount in grams
 * @property {Object} nutrients - Nutritional values for this item
 */
let mealIdCounter = 0;

export function createMeal(name, date) {
  mealIdCounter += 1;
  return {
    id: `meal-${mealIdCounter}`,
    name,
    date: date || new Date().toISOString().split('T')[0],
    items: [],
  };
}

/**
 * Adds an item to a meal.
 *
 * @param {Meal} meal - The meal to add the item to
 * @param {string} productId - ID of the product
 * @param {number} amount - Amount in grams
 * @param {Object} product - Product object with name and nutrients
 * @param {string} product.name - Product name
 * @param {Object} product.nutrients - Nutritional information per serving
 * @param {number} product.servingSize - Serving size amount
 * @returns {Meal} The updated meal
 */
export function addMealItem(meal, productId, amount, product) {
  const ratio = amount / product.servingSize;

  const itemNutrients = {};
  for (const key of Object.keys(product.nutrients)) {
    itemNutrients[key] = {
      value: product.nutrients[key].value * ratio,
      unit: product.nutrients[key].unit,
      per: product.nutrients[key].per,
    };
  }

  meal.items.push({
    productId,
    productName: product.name,
    amount,
    nutrients: itemNutrients,
  });

  return meal;
}

/**
 * Calculates the total nutritional values for a meal.
 *
 * @param {Meal} meal - The meal to calculate totals for
 * @returns {NutrientMap} Total nutritional values
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
export function getMealTotal(meal) {
  const total = {
    energy: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    sodium: 0,
  };

  for (const item of meal.items) {
    for (const key of Object.keys(total)) {
      if (item.nutrients[key] && item.nutrients[key].value !== undefined) {
        total[key] += item.nutrients[key].value;
      }
    }
  }

  return total;
}

/**
 * Creates a meal plan with a name and an array of meals.
 *
 * @param {string} name - Meal plan name
 * @param {Array<Meal>} meals - Array of meal objects
 * @returns {MealPlan} A meal plan object
 *
 * @typedef {Object} MealPlan
 * @property {string} id - Unique meal plan identifier
 * @property {string} name - Meal plan name
 * @property {Array<Meal>} meals - Array of meals in the plan
 */
let mealPlanIdCounter = 0;

export function createMealPlan(name, meals) {
  mealPlanIdCounter += 1;
  return {
    id: `mealPlan-${mealPlanIdCounter}`,
    name,
    meals: meals || [],
  };
}