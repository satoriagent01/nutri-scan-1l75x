import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createProduct, calculateNutrients } from "../src/products.js";

describe("createProduct", () => {
  test("AC-2: creates a product with name, nutrients, serving size and unit", () => {
    const nutrients = {
      energy: { value: 549, unit: "kcal", per: "100g" },
      fat: { value: 33, unit: "g", per: "100g" },
      saturatedFat: { value: 13, unit: "g", per: "100g" },
      carbohydrates: { value: 55, unit: "g", per: "100g" },
      sugars: { value: 45, unit: "g", per: "100g" },
      fiber: { value: 2.4, unit: "g", per: "100g" },
      protein: { value: 6.8, unit: "g", per: "100g" },
      sodium: { value: 0.18, unit: "g", per: "100g" }
    };

    const product = createProduct("Hazelnut Chocolate Bar", nutrients, 100, "g");

    assert.strictEqual(product.name, "Hazelnut Chocolate Bar");
    assert.strictEqual(product.servingSize, 100);
    assert.strictEqual(product.servingUnit, "g");
    assert.deepStrictEqual(product.nutrients, nutrients);
  });

  test("AC-2: handles products with different serving units", () => {
    const nutrients = {
      energy: { value: 399, unit: "kJ", per: "200ml" },
      fat: { value: 0, unit: "g", per: "200ml" },
      carbohydrates: { value: 22, unit: "g", per: "200ml" },
      sugars: { value: 20, unit: "g", per: "200ml" },
      protein: { value: 0.4, unit: "g", per: "200ml" },
      sodium: { value: 0, unit: "g", per: "200ml" }
    };

    const product = createProduct("Apple Juice", nutrients, 200, "ml");

    assert.strictEqual(product.name, "Apple Juice");
    assert.strictEqual(product.servingSize, 200);
    assert.strictEqual(product.servingUnit, "ml");
  });
});

describe("calculateNutrients", () => {
  test("AC-3: calculates nutrients for amount equal to serving size", () => {
    const nutrients = {
      energy: { value: 549, unit: "kcal", per: "100g" },
      fat: { value: 33, unit: "g", per: "100g" },
      saturatedFat: { value: 13, unit: "g", per: "100g" },
      carbohydrates: { value: 55, unit: "g", per: "100g" },
      sugars: { value: 45, unit: "g", per: "100g" },
      fiber: { value: 2.4, unit: "g", per: "100g" },
      protein: { value: 6.8, unit: "g", per: "100g" },
      sodium: { value: 0.18, unit: "g", per: "100g" }
    };

    const product = createProduct("Hazelnut Chocolate Bar", nutrients, 100, "g");
    const result = calculateNutrients(product, 100);

    assert.strictEqual(result.energy, 549);
    assert.strictEqual(result.fat, 33);
    assert.strictEqual(result.saturatedFat, 13);
    assert.strictEqual(result.carbohydrates, 55);
    assert.strictEqual(result.sugars, 45);
    assert.strictEqual(result.fiber, 2.4);
    assert.strictEqual(result.protein, 6.8);
    assert.strictEqual(result.sodium, 0.18);
  });

  test("AC-3: calculates nutrients for half serving size", () => {
    const nutrients = {
      energy: { value: 549, unit: "kcal", per: "100g" },
      fat: { value: 33, unit: "g", per: "100g" },
      saturatedFat: { value: 13, unit: "g", per: "100g" },
      carbohydrates: { value: 55, unit: "g", per: "100g" },
      sugars: { value: 45, unit: "g", per: "100g" },
      fiber: { value: 2.4, unit: "g", per: "100g" },
      protein: { value: 6.8, unit: "g", per: "100g" },
      sodium: { value: 0.18, unit: "g", per: "100g" }
    };

    const product = createProduct("Hazelnut Chocolate Bar", nutrients, 100, "g");
    const result = calculateNutrients(product, 50);

    assert.strictEqual(result.energy, 274.5);
    assert.strictEqual(result.fat, 16.5);
    assert.strictEqual(result.saturatedFat, 6.5);
    assert.strictEqual(result.carbohydrates, 27.5);
    assert.strictEqual(result.sugars, 22.5);
    assert.strictEqual(result.fiber, 1.2);
    assert.strictEqual(result.protein, 3.4);
    assert.strictEqual(result.sodium, 0.09);
  });

  test("AC-3: calculates nutrients for double serving size", () => {
    const nutrients = {
      energy: { value: 549, unit: "kcal", per: "100g" },
      fat: { value: 33, unit: "g", per: "100g" },
      saturatedFat: { value: 13, unit: "g", per: "100g" },
      carbohydrates: { value: 55, unit: "g", per: "100g" },
      sugars: { value: 45, unit: "g", per: "100g" },
      fiber: { value: 2.4, unit: "g", per: "100g" },
      protein: { value: 6.8, unit: "g", per: "100g" },
      sodium: { value: 0.18, unit: "g", per: "100g" }
    };

    const product = createProduct("Hazelnut Chocolate Bar", nutrients, 100, "g");
    const result = calculateNutrients(product, 200);

    assert.strictEqual(result.energy, 1098);
    assert.strictEqual(result.fat, 66);
    assert.strictEqual(result.saturatedFat, 26);
    assert.strictEqual(result.carbohydrates, 110);
    assert.strictEqual(result.sugars, 90);
    assert.strictEqual(result.fiber, 4.8);
    assert.strictEqual(result.protein, 13.6);
    assert.strictEqual(result.sodium, 0.36);
  });

  test("AC-3: calculates nutrients for ml-based serving", () => {
    const nutrients = {
      energy: { value: 399, unit: "kJ", per: "200ml" },
      fat: { value: 0, unit: "g", per: "200ml" },
      carbohydrates: { value: 22, unit: "g", per: "200ml" },
      sugars: { value: 20, unit: "g", per: "200ml" },
      protein: { value: 0.4, unit: "g", per: "200ml" },
      sodium: { value: 0, unit: "g", per: "200ml" }
    };

    const product = createProduct("Apple Juice", nutrients, 200, "ml");
    const result = calculateNutrients(product, 100);

    assert.strictEqual(result.energy, 199.5);
    assert.strictEqual(result.fat, 0);
    assert.strictEqual(result.carbohydrates, 11);
    assert.strictEqual(result.sugars, 10);
    assert.strictEqual(result.protein, 0.2);
    assert.strictEqual(result.sodium, 0);
  });
});