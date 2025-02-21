import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  item: { type: String, required: true, trim: true },
  quantity: { type: String, trim: true, default: null },
  notes: { type: String, trim: true, default: null }
});

const cookingTimeSchema = new mongoose.Schema({
  preparationTime: { type: String, required: true, trim: true },
  cookingTime: { type: String, required: true, trim: true },
  difficultyLevel: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] }
});

const recipeSchema = new mongoose.Schema({
  dishName: { type: String, required: true, trim: true, unique: true },
  briefDescription: { type: String, required: true, trim: true, minlength: 10 },
  ingredients: { type: [ingredientSchema] },
  cookingInstructions: { type: [String], required: true },
  cookingTimeAndDifficulty: { type: cookingTimeSchema, required: true },
  servingSuggestions: { type: String, required: true, trim: true },
  youtubeTutorial: { type: String, trim: true, default: null },
  dishImageUrl: { type: String, required: true, trim: true }
}, { timestamps: true });

// Middleware for validation
recipeSchema.pre('save', function (next) {
  if (!this.ingredients || this.ingredients.length === 0) {
    return next(new Error('Ingredients list cannot be empty.'));
  }
  if (!this.cookingInstructions || this.cookingInstructions.length === 0) {
    return next(new Error('Cooking instructions cannot be empty.'));
  }
  if (this.youtubeTutorial && !/^https?:\/\/.+/.test(this.youtubeTutorial)) {
    return next(new Error('Invalid YouTube tutorial URL.'));
  }
  if (!/^https?:\/\/.+/.test(this.dishImageUrl)) {
    return next(new Error('Invalid Dish Image URL.'));
  }
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
