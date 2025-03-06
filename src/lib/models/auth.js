import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String] },
    withdrawalAccount: { type: String },
    accountNumber: { type: String },
    points: { type: Number }
}, { timestamps: true })

export const authModel = mongoose.models.users || mongoose.model("users", authSchema)