# NutriScan - Nutritional Label Scanner & Meal Planner

## Overview
NutriScan is a free, ad-free web application that allows users to:
1. Take photos of nutritional labels from food products
2. Extract nutritional information using OCR with AI
3. Create custom meal plans by specifying grams of each product
4. Track nutritional intake based on meal plans

## Stack
- **Runtime**: Node 24 with ES modules
- **Testing**: Node's built-in test runner (`node --test`)
- **Build**: No build step
- **UI**: Static web page in `public/`
- **AI**: OpenAI-compatible endpoint (configured by user via URL and key)
- **Data Storage**: localStorage (browser) or passed storage object (tests)

## Data Model

### Product
```typescript
interface Product {
  id: string;
  name: string;
  brand?: string;
  servingSize: number; // in grams
  servingUnit: string; // e.g., "g", "ml"
  nutrients: NutrientMap;
  imageUrl?: string;
  createdAt: string; // ISO date string
}
```

### NutrientMap
```typescript
interface NutrientMap {
  energy?: { value: number; unit: string }; // e.g., { value: 2292, unit: "kJ" } or { value: 549, unit: "kcal" }
  fat?: { value: number; unit: string }; // e.g., { value: 33, unit: "g" }
  saturatedFat?: { value: number; unit: string };
  carbohydrates?: { value: number; unit: string };
  sugars?: { value: number; unit: string };
  fiber?: { value: number; unit: string };
  protein?: { value: number; unit: string };
  sodium?: { value: number; unit: string };
  [nutrientName: string]: { value: number; unit: string } | undefined;
}
```

### Meal
```typescript
interface Meal {
  id: string;
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
  items: MealItem[];
  createdAt: string;
}
```

### MealItem
```typescript
interface MealItem {
  productId: string;
  amount: number; // in grams
  product: Product; // embedded product data
}
```

### MealPlan
```typescript
interface MealPlan {
  id: string;
  name: string;
  meals: Meal[];
  createdAt: string;
}
```

## OCR/AI Extraction

The OCR process uses an OpenAI-compatible endpoint. The user configures the URL and API key. The AI extracts nutritional information from the image and returns structured data.

### OCR Result
```typescript
interface OCRResult {
  product: Product;
  confidence: number; // 0-1
  rawText?: string;
}
```

## Modules

### src/ocr.js
- `extractNutrition(imageData: string, config: { url: string, key: string }): Promise<OCRResult>`
  - Takes base64 image data and AI config
  - Returns extracted product with nutrients
  - Example: From image 1, extracts product with servingSize 100g, energy 2292 kJ, fat 33g, etc.

### src/products.js
- `createProduct(name: string, nutrients: NutrientMap, servingSize: number, servingUnit: string): Product`
  - Creates a new product object
  - Example: `createProduct("Hazelnut Chocolate", { energy: { value: 549, unit: "kcal" }, fat: { value: 33, unit: "g" } }, 100, "g")`
- `calculateNutrients(product: Product, amount: number): NutrientMap`
  - Calculates nutrients for a given amount (in grams)
  - Example: For 30g of product with 549 kcal/100g, returns { energy: { value: 164.7, unit: "kcal" } }

### src/meals.js
- `createMeal(name: string, date: string): Meal`
  - Creates a new meal
- `addMealItem(meal: Meal, productId: string, amount: number, product: Product): Meal`
  - Adds an item to a meal
- `getMealTotal(meal: Meal): NutrientMap`
  - Returns total nutrients for the meal
- `createMealPlan(name: string, meals: Meal[]): MealPlan`
  - Creates a meal plan with multiple meals

### src/storage.js
- `saveProduct(product: Product, storage: Object): void`
  - Saves product to storage object
- `getProducts(storage: Object): Product[]`
  - Gets all products from storage
- `saveMeal(meal: Meal, storage: Object): void`
  - Saves meal to storage object
- `getMeals(storage: Object): Meal[]`
  - Gets all meals from storage
- `saveMealPlan(plan: MealPlan, storage: Object): void`
  - Saves meal plan to storage object
- `getMealPlans(storage: Object): MealPlan[]`
  - Gets all meal plans from storage

## Acceptance Criteria

### AC-1: OCR Extraction
- The app can extract nutritional information from product images
- Extracted data includes: energy, fat, saturated fat, carbohydrates, sugars, fiber, protein, sodium
- Example from Image 1: Product with serving size 100g, energy 2292 kJ (549 kcal), fat 33g, saturated fat 13g, carbohydrates 55g, sugars 45g, fiber 2.4g, protein 6.8g, sodium 0.18g
- Example from Image 2: Product with serving size 100ml, energy 199 kJ (47 kcal), fat 0g, carbohydrates 11g, sugars 10g, protein 0.7g, sodium 0.4g
- Example from Image 3: Product with serving size 100ml, energy 3404 kJ (828 kcal), fat 92g, saturated fat 14g, carbohydrates 0g, sugars 0g, protein 0g, sodium 0g

### AC-2: Product Management
- Users can save products with their nutritional information
- Products can be retrieved and displayed
- Products include name, brand, serving size, and all extracted nutrients

### AC-3: Meal Planning
- Users can create meals with multiple products
- Users can specify the amount (in grams) of each product in their meal
- The app calculates total nutrients for each meal
- Example: A meal with 30g of product from Image 1 would have energy 164.7 kcal, fat 9.9g, etc.

### AC-4: Nutritional Tracking
- Users can track their daily nutritional intake
- The app sums up nutrients from all meals in a day
- Users can view their total intake for any nutrient (calories, sodium, saturated fats, etc.)

### AC-5: Custom Tracking
- Users can track any nutrient, not just predefined ones
- The app supports custom nutrient names and values
- Users can set their own nutritional goals

### AC-6: User Interface
- The app has a clean, intuitive interface
- Users can take photos or upload images
- Users can view their products, meals, and tracking data
- The app is responsive and works on mobile devices

### AC-7: Free and Ad-Free
- The app is completely free to use
- No advertisements or premium features
- All features are available to all users

## Examples from Shared Images

### Image 1: Hazelnut Chocolate Bar
- **Product**: Hazelnut chocolate bar (multilingual label)
- **Serving Size**: 100g (also shows 30g = 1 Melto)
- **Nutrients per 100g**:
  - Energy: 2292 kJ / 549 kcal
  - Fat: 33g
  - Saturated Fat: 13g
  - Carbohydrates: 55g
  - Sugars: 45g
  - Fiber: 2.4g
  - Protein: 6.8g
  - Sodium: 0.18g
- **Nutrients per 30g**:
  - Energy: 688 kJ / 165 kcal
  - Fat: 10g
  - Saturated Fat: 3.9g
  - Carbohydrates: 16g
  - Sugars: 14g
  - Fiber: 0.7g
  - Protein: 2.0g
  - Sodium: 0.05g

### Image 2: Apple-Orange-Mango Juice
- **Product**: Versgeperst appel-sinaasappel-en mangosap (Fresh pressed apple-orange-mango juice)
- **Serving Size**: 100ml (also shows 200ml glass)
- **Nutrients per 100ml**:
  - Energy: 199 kJ / 47 kcal
  - Fat: 0g
  - Saturated Fat: 0g
  - Carbohydrates: 11g
  - Sugars: 10g
  - Protein: 0.7g
  - Sodium: 0.4g
- **Nutrients per 200ml**:
  - Energy: 399 kJ / 94 kcal
  - Fat: 0g
  - Saturated Fat: 0g
  - Carbohydrates: 22g
  - Sugars: 20g
  - Protein: 1.4g
  - Sodium: 0.8g

### Image 3: Extra Virgin Olive Oil Spray
- **Product**: Extra oliefolie van de eerste persing (Extra virgin olive oil spray)
- **Serving Size**: 100ml (also shows 2.5g per spray)
- **Nutrients per 100ml**:
  - Energy: 3404 kJ / 828 kcal
  - Fat: 92g
  - Saturated Fat: 14g
  - Carbohydrates: 0g
  - Sugars: 0g
  - Protein: 0g
  - Sodium: 0g

## Testing Notes
- The OCR/AI module should be configurable with a mock endpoint for testing
- Tests should verify data calculations and storage operations
- The UI should be tested separately from the core logic
- All modules should be pure functions where possible