import express from "express";
import { suggestRecipes, getAllRecipes, getRecipeDetailsController } from "../controllers/recipie.controller.js";

const router = express.Router();

router.post("/suggestRecipes", suggestRecipes);
router.post("/getRecipeDetails", getRecipeDetailsController);
router.get("/all", getAllRecipes);

export default router;
