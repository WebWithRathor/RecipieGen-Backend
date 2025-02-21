import {
  getRecipeDetails,
  getRecipeSuggestions,
} from "../Services/Gemini.service.js";
import Recipe from "../models/recipie.model.js";

export const suggestRecipes = async (req, res) => {
  try {
    const { ingredients, description } = req.body;
    if (!ingredients?.length && !description) {
      return res
        .status(400)
        .json({ error: "Please provide ingredients or a description." });
    }
    const suggestions = await getRecipeSuggestions(ingredients, description);
    res.status(200).json({ suggestions });
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
    let recipe = await Recipe.findOne({ dishName });
    if (!recipe) {
      const newRecipeData = await getRecipeDetails(dishName);
      if (!newRecipeData) {
        return res.status(500).json({ error: "Failed to generate recipe." });
      }
      recipe = new Recipe(newRecipeData);
      await recipe.save();
    }

    res.status(200).json({ recipe });
  } catch (error) {
    console.error("Error in getRecipeDetailsController:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
