import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import recipeRoutes from "./routes/recipe.Routes.js";
import { config } from "./config/config.js";
import cookieParser from "cookie-parser";
import { isAuthenticated } from "./middlewares/auth.middleware.js";
import helmet from "helmet";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());

const allowedOrigins = config.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

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
