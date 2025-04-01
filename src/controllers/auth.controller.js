import { config } from "../config/config.js";
import { setCookies } from "../middlewares/auth.middleware.js";
import userModel from "../models/user.model.js";
import { successResponse, responses } from "../utils/responseHandler.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (name === undefined || email === undefined || password === undefined) return responses.MISSING_CREDENTIALS(res);
        const existingUser = await userModel.findOne({ email });
        if (existingUser) return responses.USER_ALREADY_EXISTS(res);
        const newUser = new userModel({ name, email, password });
        const { accessToken, refreshToken } = await newUser.generateTokens();
        await setCookies(res, accessToken, refreshToken);
        await newUser.save();
        return successResponse(res, 201, "User registered successfully", newUser);
    } catch (error) {
        return responses.SERVER_ERROR(res, error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email === undefined || password === undefined) return responses.MISSING_CREDENTIALS(res);
        const user = await userModel.findOne({ email }).populate("savedDishes");
        if (!user) return responses.USER_NOT_FOUND(res);
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return responses.INVALID_CREDENTIALS(res);
        const { accessToken, refreshToken } = await user.generateTokens();
        await setCookies(res, accessToken, refreshToken);
        return successResponse(res, 200, "Login successful", user);
    } catch (error) {
        return responses.SERVER_ERROR(res, error);
    }
};

export const logout = async (req, res) => {
    try {
        console.log("res.cookie");
        
         if (!req.cookies.refreshToken) {
            return responses.BAD_REQUEST(res, "No refresh token found");
        }

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "None" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });

        
        const user = await userModel.findOneAndUpdate({ refreshToken: req.cookies.refreshToken }, { refreshToken: null });
        console.log(user);
        return successResponse(res, 200, "Logout successful");
    } catch (error) {
        return responses.SERVER_ERROR(res, error);
    }
};


export const currentUser = async (req, res) => {
    const user = await userModel.findById(req.user.id).select("-password -refreshToken").populate("savedDishes");
    res.json({ message: "User profile", user });
}
