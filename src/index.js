import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.Routes.js";
import { config } from "./config/config.js";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middlewares/auth.middleware.js";

const app = express();

const allowedOrigins = [
  "https://recipie-gen-frontend-9eqtd6uor.vercel.app",
  "http://localhost:5173" // Allow localhost for development
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => allowed === origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api/recipe', isAuthenticated, recipeRoutes);
app.use("/api/auth", authRoutes);

app.use("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

export default app;
