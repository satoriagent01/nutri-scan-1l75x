/**
 * Storage operations for products, meals, and meal plans.
 * Uses a plain object as storage backend.
 */

/**
 * Saves a product to storage.
 *
 * @param {Object} storage - The storage object
 * @param {Object} product - The product to save
 * @returns {Object} The storage object
 */
export function saveProduct(storage, product) {
  if (!storage.products) {
    storage.products = [];
  }
  // Check if product already exists, update it
  const existingIndex = storage.products.findIndex((p) => p.id === product.id);
  if (existingIndex >= 0) {
    storage.products[existingIndex] = product;
  } else {
    storage.products.push(product);
  }
  return storage;
}

/**
 * Retrieves all products from storage.
 *
 * @param {Object} storage - The storage object
 * @returns {Array} Array of products
 */
export function getProducts(storage) {
  return storage.products || [];
}

/**
 * Saves a meal to storage.
 *
 * @param {Object} storage - The storage object
 * @param {Object} meal - The meal to save
 * @returns {Object} The storage object
 */
export function saveMeal(storage, meal) {
  if (!storage.meals) {
    storage.meals = [];
  }
  // Check if meal already exists, update it
  const existingIndex = storage.meals.findIndex((m) => m.id === meal.id);
  if (existingIndex >= 0) {
    storage.meals[existingIndex] = meal;
  } else {
    storage.meals.push(meal);
  }
  return storage;
}

/**
 * Retrieves all meals from storage.
 *
 * @param {Object} storage - The storage object
 * @returns {Array} Array of meals
 */
export function getMeals(storage) {
  return storage.meals || [];
}

/**
 * Saves a meal plan to storage.
 *
 * @param {Object} storage - The storage object
 * @param {Object} mealPlan - The meal plan to save
 * @returns {Object} The storage object
 */
export function saveMealPlan(storage, mealPlan) {
  storage.mealPlan = mealPlan;
  return storage;
}

/**
 * Retrieves the meal plan from storage.
 *
 * @param {Object} storage - The storage object
 * @returns {Object|null} The meal plan or null if not found
 */
export function getMealPlan(storage) {
  return storage.mealPlan || null;
}