import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import { responses } from "../utils/responseHandler.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!accessToken) {
            if (!refreshToken) {
                return responses.UNAUTHORIZED(res);
            }
            try {
                const decodedRefresh = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
                const user = await userModel.findById(decodedRefresh.id);

                if (!user || user.refreshToken !== refreshToken) {
                    return responses.FORBIDDEN(res);
                }
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await user.generateTokens();
                await setCookies(res, newAccessToken, newRefreshToken);
                req.user = user;
                return next();
            } catch (refreshError) {
                return responses.FORBIDDEN(res);
            }
        }
        try {
            const decoded = jwt.verify(accessToken, config.JWT_SECRET);
            req.user = await userModel.findById(decoded.id);
            next();
        } catch (accessError) {
            return responses.UNAUTHORIZED(res);
        }
    } catch (error) {
        return responses.SERVER_ERROR(res, error);
    }
};



export const setCookies = async (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge:Number( config.JWT_COOKIE_EXPIRES_IN),
    });
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge:Number(config.REFRESH_COOKIE_EXPIRES_IN),
    });
};

