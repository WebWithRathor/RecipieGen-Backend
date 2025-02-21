import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port : process.env.PORT,
    geminiApiKey:process.env.GEMINI_API_KEY,
    mongoURI : process.env.MONGODB_URI
}