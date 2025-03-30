import { config } from "../config/config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Generative AI client
const genAI = new GoogleGenerativeAI(config.geminiApiKey);


// System instruction for the AI model
const systemInstruction = `
You are a professional culinary assistant specializing in generating delicious and creative recipes.
You should handle two types of requests:

1️⃣ **Recipe Suggestions Mode**:  
   - When asked for **recipe suggestions**, generate 4-5 **dish names** with a **brief description** and **Dish Image URL** of each.
   - Format the response as a **JSON array**:  
     \`\`\`json
     [
       { "dishName": "Dish Name Here", "briefDescription": "A short description of the dish.","Dish Image URL": "Provide an AI-generated((pollinations.ai)) image URL for the dish." }
     ]
     \`\`\`

2️⃣ **Full Recipe Details Mode**:  
   - When asked for **details of a specific dish**, provide a structured and detailed recipe in **JSON format**:  
     \`\`\`json
     {
       "dishName": "Dish Name Here",
       "briefDescription": "A short introduction to the dish, explaining its flavor and style.",
       "ingredients": [
         {
           "item": "Ingredient Name",
           "quantity": "Quantity",
           "notes": "Optional notes (e.g., chopped, minced, etc.)"
         }
       ],
       "cookingInstructions": [
         "Step one description.",
         "Step two description.",
         "Continue with clear, step-by-step cooking instructions."
         (for Example : **Prepare the Koftas:** In a bowl, combine grated paneer, chopped spinach, etc.
**Fry the Koftas:** Heat oil in a pan and fry until golden brown.)
       ],
       "cookingTimeAndDifficulty": {
         "preparationTime": "XX minutes",
         "cookingTime": "XX minutes",
         "difficultyLevel": "Easy/Medium/Hard"
       },
       "servingSuggestions": "Optional plating tips, pairings, or variations.",
       "youtubeTutorial": "Provide a relevant YouTube video link if possible.",
       "dishImageUrl": "Provide an AI-generated(pollinations.ai) image URL for the dish."
     }
     \`\`\`

🔹 **Important Rules**:  
   - Always return a **valid JSON response** based on the requested mode.
   - Ensure **clear, step-by-step instructions** for cooking.
   - If an ingredient is uncommon, suggest an **alternative**.
   - Keep responses **concise and well-structured**.
`;

// Set up text model
const textModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction
});

const textConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to generate recipe suggestions
export const getRecipeSuggestions = async (ingredients = [],description="",preference) => {
  try {
    const chatSession = textModel.startChat({ generationConfig: textConfig });
    
    const result = await chatSession.sendMessage(
      `Suggest 4-5 creative dish ideas using these ingredients: ${ingredients.join(", ")} and with this description ${description.trim()} and with this ${preference.trim()}. Return a valid JSON array.`
    );
    
    let suggestions = result?.response?.text();

    if (typeof suggestions === "string") {
      suggestions = suggestions
        .replace(/^```json\s*/, "") // Remove starting ```json and extra spaces
        .replace(/```$/, "") // Remove ending ```
        .trim();

        suggestions = JSON.parse(suggestions);

    }

    return  suggestions;
  } catch (error) {
    console.log(error);
    
    console.error("Error generating recipe suggestions:", error.message);
    return [];
  }
};


// Function to generate a detailed recipe
export const getRecipeDetails = async (dishName) => {
  try {
    const chatSession = textModel.startChat({ generationConfig: textConfig });
    const result = await chatSession.sendMessage(
      `Provide a detailed recipe for the dish: ${dishName}. Include a YouTube tutorial link if possible.`
    );

    let recipe = result?.response?.text();
    
    if (typeof recipe === "string") {
      recipe = recipe.replace(/^```json/, "").replace(/```$/, "").trim();
      recipe = JSON.parse(recipe);
    }

    if (!recipe || typeof recipe !== "object") {
      throw new Error("Invalid recipe format");
    }

    return recipe;
  } catch (error) {
    console.error("Error generating recipe details:", error.message);
    return null;
  }
};
