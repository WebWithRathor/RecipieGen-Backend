import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port : process.env.PORT,
    geminiApiKey:process.env.GEMINI_API_KEY,
    mongoURI : process.env.MONGODB_URI,
    redisHost:process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPassword: process.env.REDIS_PASSWORD,
    
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    JWT_COOKIE_EXPIRES_IN: process.env.JWT_COOKIE_EXPIRES_IN || "4h",

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    REFRESH_COOKIE_EXPIRES_IN: process.env.REFRESH_COOKIE_EXPIRES_IN || "7d",

    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    CLIENT_URL: process.env.CLIENT_URL,
}