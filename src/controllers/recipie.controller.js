import {
  getRecipeDetails,
  getRecipeSuggestions,
} from "../Services/Gemini.service.js";
import Recipe from "../models/recipie.model.js";
import userModel from "../models/user.model.js";
import redis from "../utils/redis.js";

export const suggestRecipes = async (req, res) => {
  try {
    const { ingredients, description, preference } = req.body;

    if (!ingredients?.length && !description) {
      return res
        .status(400)
        .json({ error: "Please provide ingredients or a description." });
    }
    const key = `Suggestions->${description.trim()}-${ingredients.join(",")}-${preference.trim()}`;
    const cachedSuggestions = await redis.get(key);
    if (cachedSuggestions) {
      return res.status(200).json({ suggestions: JSON.parse(cachedSuggestions) });
    } else {
      const suggestions = await getRecipeSuggestions(ingredients, description, preference);
      redis.set(key, JSON.stringify(suggestions), "EX", 3600 * 24);
      res.status(200).json({ suggestions });
    }
  } catch (error) {
    console.error("Error in suggestRecipes:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json({ recipes });
  } catch (error) {
    console.error("Error in getAllRecipes:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecipeDetailsController = async (req, res) => {
  try {
    const { dishName } = req.body;
    
    if (!dishName) {
      return res.status(400).json({ error: "Please provide a dish name." });
    }
    const key = `Recipe->${dishName.trim()}`;
    const cachedRecipe = await redis.get(key);
    
    if (cachedRecipe) {
      return res.status(200).json({ recipe: JSON.parse(cachedRecipe) });
    } else {
      let recipe = await Recipe.findOne({ dishName });
      redis.set(key, JSON.stringify(recipe), "EX", 3600 * 24);
      if (!recipe) {
        const newRecipeData = await getRecipeDetails(dishName);
        if (!newRecipeData) {
          return res.status(500).json({ error: "Failed to generate recipe." });
        }
        recipe = new Recipe(newRecipeData);
        await recipe.save();
      }
      res.status(200).json({ recipe });
    }
  } catch (error) {
    console.error("Error in getRecipeDetailsController:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Save a recipe to the user's saved list
export const saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      return res.status(400).json({ error: "User ID and Recipe ID are required." });
    }
    
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    if (!user.savedDishes.includes(recipeId)) {
      user.savedDishes.push(recipeId);
      await user.save();
    }
    await user.populate("savedDishes");
    
    res.status(200).json({ message: "Recipe saved successfully!" ,savedDishes:user.savedDishes });
  } catch (error) {
    console.error("Error in saveRecipe:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove a recipe from the user's saved list
export const removeRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;

    
    if (!recipeId) {
      return res.status(400).json({ error: "User ID and Recipe ID are required." });
    }
    
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    
    user.savedDishes = user.savedDishes.filter(id => id.toString() !== recipeId);
    await user.save();
    await user.populate("savedDishes");
    
    res.status(200).json({ message: "Recipe removed from saved list.",savedDishes:user.savedDishes });
  } catch (error) {
    console.error("Error in removeRecipe:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
