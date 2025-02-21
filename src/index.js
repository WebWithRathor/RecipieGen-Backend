import express from "express";
import morgan from "morgan";
import cors from "cors";
import recipeRoutes from './routes/recipe.Routes.js'
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));


app.use('/api/recipe',recipeRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});


export default app;
