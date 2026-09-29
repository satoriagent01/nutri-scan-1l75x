import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  saveProduct,
  getProducts,
  saveMeal,
  getMeals,
  saveMealPlan,
  getMealPlan
} from "../src/storage.js";

describe("saveProduct / getProducts", () => {
  test("AC-1: saves and retrieves a product", () => {
    const storage = {};
    const product = {
      id: "product-1",
      name: "Hazelnut Chocolate Bar",
      servingSize: 100,
      servingUnit: "g",
      nutrients: {
        energy: { value: 549, unit: "kcal", per: "100g" },
        fat: { value: 33, unit: "g", per: "100g" },
        saturatedFat: { value: 13, unit: "g", per: "100g" },
        carbohydrates: { value: 55, unit: "g", per: "100g" },
        sugars: { value: 45, unit: "g", per: "100g" },
        fiber: { value: 2.4, unit: "g", per: "100g" },
        protein: { value: 6.8, unit: "g", per: "100g" },
        sodium: { value: 0.18, unit: "g", per: "100g" }
      }
    };

    saveProduct(storage, product);
    const products = getProducts(storage);

    assert.strictEqual(products.length, 1);
    assert.deepStrictEqual(products[0], product);
  });

  test("AC-1: saves multiple products", () => {
    const storage = {};
    const product1 = {
      id: "product-1",
      name: "Hazelnut Chocolate Bar",
      servingSize: 100,
      servingUnit: "g",
      nutrients: {
        energy: { value: 549, unit: "kcal", per: "100g" },
        fat: { value: 33, unit: "g", per: "100g" },
        saturatedFat: { value: 13, unit: "g", per: "100g" },
        carbohydrates: { value: 55, unit: "g", per: "100g" },
        sugars: { value: 45, unit: "g", per: "100g" },
        fiber: { value: 2.4, unit: "g", per: "100g" },
        protein: { value: 6.8, unit: "g", per: "100g" },
        sodium: { value: 0.18, unit: "g", per: "100g" }
      }
    };
    const product2 = {
      id: "product-2",
      name: "Apple Juice",
      servingSize: 200,
      servingUnit: "ml",
      nutrients: {
        energy: { value: 399, unit: "kJ", per: "200ml" },
        fat: { value: 0, unit: "g", per: "200ml" },
        carbohydrates: { value: 22, unit: "g", per: "200ml" },
        sugars: { value: 20, unit: "g", per: "200ml" },
        protein: { value: 0.4, unit: "g", per: "200ml" },
        sodium: { value: 0, unit: "g", per: "200ml" }
      }
    };

    saveProduct(storage, product1);
    saveProduct(storage, product2);
    const products = getProducts(storage);

    assert.strictEqual(products.length, 2);
    assert.strictEqual(products[0].id, "product-1");
    assert.strictEqual(products[1].id, "product-2");
  });

  test("AC-1: returns empty array when no products saved", () => {
    const storage = {};
    const products = getProducts(storage);

    assert.deepStrictEqual(products, []);
  });
});

describe("saveMeal / getMeals", () => {
  test("AC-1: saves and retrieves a meal", () => {
    const storage = {};
    const meal = {
      id: "meal-1",
      name: "Breakfast",
      date: "2024-01-15",
      items: [
        {
          productId: "product-1",
          amount: 100,
          productName: "Hazelnut Chocolate Bar"
        }
      ]
    };

    saveMeal(storage, meal);
    const meals = getMeals(storage);

    assert.strictEqual(meals.length, 1);
    assert.deepStrictEqual(meals[0], meal);
  });

  test("AC-1: saves multiple meals", () => {
    const storage = {};
    const meal1 = {
      id: "meal-1",
      name: "Breakfast",
      date: "2024-01-15",
      items: []
    };
    const meal2 = {
      id: "meal-2",
      name: "Lunch",
      date: "2024-01-15",
      items: []
    };

    saveMeal(storage, meal1);
    saveMeal(storage, meal2);
    const meals = getMeals(storage);

    assert.strictEqual(meals.length, 2);
    assert.strictEqual(meals[0].id, "meal-1");
    assert.strictEqual(meals[1].id, "meal-2");
  });

  test("AC-1: returns empty array when no meals saved", () => {
    const storage = {};
    const meals = getMeals(storage);

    assert.deepStrictEqual(meals, []);
  });
});

describe("saveMealPlan / getMealPlan", () => {
  test("AC-1: saves and retrieves a meal plan", () => {
    const storage = {};
    const mealPlan = {
      id: "plan-1",
      name: "Weekly Plan",
      meals: [
        {
          id: "meal-1",
          name: "Breakfast",
          date: "2024-01-15",
          items: []
        },
        {
          id: "meal-2",
          name: "Lunch",
          date: "2024-01-15",
          items: []
        }
      ]
    };

    saveMealPlan(storage, mealPlan);
    const retrieved = getMealPlan(storage);

    assert.deepStrictEqual(retrieved, mealPlan);
  });

  test("AC-1: returns null when no meal plan saved", () => {
    const storage = {};
    const retrieved = getMealPlan(storage);

    assert.strictEqual(retrieved, null);
  });

  test("AC-1: overwrites existing meal plan", () => {
    const storage = {};
    const mealPlan1 = {
      id: "plan-1",
      name: "Old Plan",
      meals: []
    };
    const mealPlan2 = {
      id: "plan-2",
      name: "New Plan",
      meals: [
        {
          id: "meal-1",
          name: "Breakfast",
          date: "2024-01-15",
          items: []
        }
      ]
    };

    saveMealPlan(storage, mealPlan1);
    saveMealPlan(storage, mealPlan2);
    const retrieved = getMealPlan(storage);

    assert.strictEqual(retrieved.name, "New Plan");
    assert.strictEqual(retrieved.meals.length, 1);
  });
});