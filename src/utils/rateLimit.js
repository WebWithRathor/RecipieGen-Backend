import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: "Too many requests, please slow down.",
});

export const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many AI-based requests. Try again later.",
});

