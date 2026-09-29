import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

describe("extractNutrition", () => {
  test("AC-1: extracts product name and nutrients from simulated AI response", async () => {
    // Simulate an OpenAI-compatible endpoint that returns parsed nutrition data
    const mockFetch = async (url, options) => {
      return {
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  productName: "Hazelnut Chocolate Bar",
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
                })
              }
            }
          ]
        })
      };
    };

    const imageData = "base64encodedimage";
    const config = {
      apiKey: "test-key",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4-vision-preview",
      fetch: mockFetch
    };

    const result = await extractNutrition(imageData, config);

    assert.strictEqual(result.productName, "Hazelnut Chocolate Bar");
    assert.strictEqual(result.nutrients.energy.value, 549);
    assert.strictEqual(result.nutrients.energy.unit, "kcal");
    assert.strictEqual(result.nutrients.fat.value, 33);
    assert.strictEqual(result.nutrients.saturatedFat.value, 13);
    assert.strictEqual(result.nutrients.carbohydrates.value, 55);
    assert.strictEqual(result.nutrients.sugars.value, 45);
    assert.strictEqual(result.nutrients.fiber.value, 2.4);
    assert.strictEqual(result.nutrients.protein.value, 6.8);
    assert.strictEqual(result.nutrients.sodium.value, 0.18);
  });

  test("AC-1: handles empty or invalid response gracefully", async () => {
    const mockFetch = async () => {
      return {
        json: async () => ({
          choices: [{ message: { content: "invalid json" } }]
        })
      };
    };

    const imageData = "base64encodedimage";
    const config = {
      apiKey: "test-key",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4-vision-preview",
      fetch: mockFetch
    };

    await assert.rejects(async () => {
      await extractNutrition(imageData, config);
    }, /Failed to parse/);
  });

  test("AC-1: extracts nutrients per serving when specified", async () => {
    const mockFetch = async () => {
      return {
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  productName: "Apple Juice",
                  servingSize: 200,
                  servingUnit: "ml",
                  nutrients: {
                    energy: { value: 399, unit: "kJ", per: "200ml" },
                    fat: { value: 0, unit: "g", per: "200ml" },
                    saturatedFat: { value: 0, unit: "g", per: "200ml" },
                    carbohydrates: { value: 22, unit: "g", per: "200ml" },
                    sugars: { value: 20, unit: "g", per: "200ml" },
                    protein: { value: 0.4, unit: "g", per: "200ml" },
                    sodium: { value: 0, unit: "g", per: "200ml" }
                  }
                })
              }
            }
          ]
        })
      };
    };

    const imageData = "base64encodedimage";
    const config = {
      apiKey: "test-key",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4-vision-preview",
      fetch: mockFetch
    };

    const result = await extractNutrition(imageData, config);

    assert.strictEqual(result.productName, "Apple Juice");
    assert.strictEqual(result.servingSize, 200);
    assert.strictEqual(result.servingUnit, "ml");
    assert.strictEqual(result.nutrients.energy.value, 399);
    assert.strictEqual(result.nutrients.carbohydrates.value, 22);
    assert.strictEqual(result.nutrients.sugars.value, 20);
  });
});