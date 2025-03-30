import express from "express";
import { logout , register, login , currentUser} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { generalLimiter } from "../utils/rateLimit.js";

const router = express.Router();

router.post("/register",generalLimiter, register);
router.post("/login",generalLimiter, login);
router.get("/logout",generalLimiter,isAuthenticated, logout);

router.get("/profile",generalLimiter, isAuthenticated, currentUser);


export default router;
