import mongoose from 'mongoose';
import { config } from '../config/config.js';

export const connectDB = async ()=>{
    try {
        await mongoose.connect(config.mongoURI);
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}