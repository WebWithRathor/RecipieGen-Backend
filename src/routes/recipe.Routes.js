import express from "express";
import { suggestRecipes, getAllRecipes, getRecipeDetailsController, saveRecipe, removeRecipe } from "../controllers/recipie.controller.js";

const router = express.Router();

router.post("/suggestRecipes", suggestRecipes);
router.post("/getRecipeDetails", getRecipeDetailsController);
router.get("/all", getAllRecipes);
router.post("/saveRecipe", saveRecipe);
router.post("/removeRecipe", removeRecipe);

export default router;
