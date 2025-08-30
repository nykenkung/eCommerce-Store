const connectDB = require("./db");
const Recipe = require("./models/recipe");
const mongoose = require("mongoose");

async function createRecipe() {
  const recipe = new Recipe({
    title: "Classic Tomato Soup",
    description: "A simple and delicious homemade tomato soup.",
    ingredients: ["Tomatoes", "Onion", "Garlic", "Vegetable Broth", "Olive Oil"],
    instructions: "1. Sauté onions and garlic. 2. Add tomatoes and broth. 3. Simmer and blend.",
    prepTimeInMinutes: 30
  });
  await recipe.save();
  console.log("✅ Created:", recipe.title);
}

async function findAllRecipes() {
  const recipes = await Recipe.find();
  console.log("✅ All Recipes:", recipes.map(r => r.title));
}

async function findRecipeByTitle(title) {
  const recipe = await Recipe.findOne({ title });
  console.log("✅ Found by title:", recipe);
}

async function updateRecipeDescription(title, newDescription) {
  const updated = await Recipe.findOneAndUpdate(
    { title },
    { description: newDescription },
    { new: true }
  );
  console.log("✅ Updated description:", updated && updated.description);
}

async function deleteRecipe(title) {
  const res = await Recipe.deleteOne({ title });
  console.log(`✅ Deleted "${title}"?`, res.deletedCount === 1);
}

(async () => {
  await connectDB();

  try {
    await createRecipe();
    await findAllRecipes();
    await findRecipeByTitle("Classic Tomato Soup");
    await updateRecipeDescription("Classic Tomato Soup", "Updated description for soup.");
    await deleteRecipe("Classic Tomato Soup");
  } catch (e) {
    console.error("❌ Error running CRUD flow:", e);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
