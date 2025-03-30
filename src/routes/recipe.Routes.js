import express from "express";
import { suggestRecipes, getAllRecipes, getRecipeDetailsController, saveRecipe, removeRecipe } from "../controllers/recipie.controller.js";
import { aiLimiter, generalLimiter } from "../utils/rateLimit.js";

const router = express.Router();

router.post("/suggestRecipes", aiLimiter, suggestRecipes);
router.post("/getRecipeDetails", aiLimiter, getRecipeDetailsController);
router.get("/all", generalLimiter, getAllRecipes);
router.post("/saveRecipe", generalLimiter, saveRecipe);
router.post("/removeRecipe", generalLimiter, removeRecipe);

export default router;
