import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from './routes/recipe.Routes.js'
import { config } from "./config/config.js";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middlewares/auth.middleware.js";
const app = express();

app.use(cors({origin:config.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use('/api/recipe',isAuthenticated, recipeRoutes);
app.use("/api/auth", authRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});


export default app;
