import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMeal, addMealItem, getMealTotal, createMealPlan } from "../src/meals.js";

describe("createMeal", () => {
  test("AC-4: creates a meal with name and date", () => {
    const meal = createMeal("Breakfast", "2024-01-15");

    assert.strictEqual(meal.name, "Breakfast");
    assert.strictEqual(meal.date, "2024-01-15");
    assert.deepStrictEqual(meal.items, []);
  });

  test("AC-4: creates a meal with default date if not provided", () => {
    const meal = createMeal("Lunch");

    assert.strictEqual(meal.name, "Lunch");
    assert.ok(meal.date);
    assert.deepStrictEqual(meal.items, []);
  });
});

describe("addMealItem", () => {
  test("AC-5: adds an item to a meal", () => {
    const meal = createMeal("Breakfast", "2024-01-15");
    const product = {
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

    const updatedMeal = addMealItem(meal, "product-1", 100, product);

    assert.strictEqual(updatedMeal.items.length, 1);
    assert.strictEqual(updatedMeal.items[0].productId, "product-1");
    assert.strictEqual(updatedMeal.items[0].amount, 100);
    assert.strictEqual(updatedMeal.items[0].productName, "Hazelnut Chocolate Bar");
  });

  test("AC-5: adds multiple items to a meal", () => {
    const meal = createMeal("Dinner", "2024-01-15");
    const product1 = {
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

    addMealItem(meal, "product-1", 100, product1);
    addMealItem(meal, "product-2", 200, product2);

    assert.strictEqual(meal.items.length, 2);
    assert.strictEqual(meal.items[0].productId, "product-1");
    assert.strictEqual(meal.items[1].productId, "product-2");
  });
});

describe("getMealTotal", () => {
  test("AC-6: returns total nutrients for a meal with one item", () => {
    const meal = createMeal("Breakfast", "2024-01-15");
    const product = {
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

    addMealItem(meal, "product-1", 100, product);
    const total = getMealTotal(meal);

    assert.strictEqual(total.energy, 549);
    assert.strictEqual(total.fat, 33);
    assert.strictEqual(total.saturatedFat, 13);
    assert.strictEqual(total.carbohydrates, 55);
    assert.strictEqual(total.sugars, 45);
    assert.strictEqual(total.fiber, 2.4);
    assert.strictEqual(total.protein, 6.8);
    assert.strictEqual(total.sodium, 0.18);
  });

  test("AC-6: returns total nutrients for a meal with multiple items", () => {
    const meal = createMeal("Dinner", "2024-01-15");
    const product1 = {
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

    addMealItem(meal, "product-1", 100, product1);
    addMealItem(meal, "product-2", 200, product2);
    const total = getMealTotal(meal);

    assert.strictEqual(total.energy, 948);
    assert.strictEqual(total.fat, 33);
    assert.strictEqual(total.saturatedFat, 13);
    assert.strictEqual(total.carbohydrates, 77);
    assert.strictEqual(total.sugars, 65);
    assert.strictEqual(total.fiber, 2.4);
    assert.strictEqual(total.protein, 7.2);
    assert.strictEqual(total.sodium, 0.18);
  });

  test("AC-6: returns zero values for empty meal", () => {
    const meal = createMeal("Snack", "2024-01-15");
    const total = getMealTotal(meal);

    assert.strictEqual(total.energy, 0);
    assert.strictEqual(total.fat, 0);
    assert.strictEqual(total.saturatedFat, 0);
    assert.strictEqual(total.carbohydrates, 0);
    assert.strictEqual(total.sugars, 0);
    assert.strictEqual(total.fiber, 0);
    assert.strictEqual(total.protein, 0);
    assert.strictEqual(total.sodium, 0);
  });
});

describe("createMealPlan", () => {
  test("AC-7: creates a meal plan with meals", () => {
    const meal1 = createMeal("Breakfast", "2024-01-15");
    const meal2 = createMeal("Lunch", "2024-01-15");
    const mealPlan = createMealPlan("Weekly Plan", [meal1, meal2]);

    assert.strictEqual(mealPlan.name, "Weekly Plan");
    assert.strictEqual(mealPlan.meals.length, 2);
    assert.strictEqual(mealPlan.meals[0].name, "Breakfast");
    assert.strictEqual(mealPlan.meals[1].name, "Lunch");
  });

  test("AC-7: creates an empty meal plan", () => {
    const mealPlan = createMealPlan("Empty Plan", []);

    assert.strictEqual(mealPlan.name, "Empty Plan");
    assert.deepStrictEqual(mealPlan.meals, []);
  });
});