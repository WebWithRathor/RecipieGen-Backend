import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String},
        role: { type: String, enum: ["student", "admin"], default: "student" },
        refreshToken: { type: String, default: null },
        savedDishes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Recipe'
        }]
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.generateTokens = async function () {
    const accessToken = jwt.sign({ id: this._id }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: this._id }, config.REFRESH_TOKEN_SECRET, { expiresIn: config.REFRESH_TOKEN_EXPIRES_IN });

    this.refreshToken = refreshToken;
    await this.save();
    return { accessToken, refreshToken };
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);

