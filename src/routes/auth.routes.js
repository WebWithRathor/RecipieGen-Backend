import express from "express";
import { logout , register, login , currentUser} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout",isAuthenticated, logout);

router.get("/profile", isAuthenticated, currentUser);


export default router;
