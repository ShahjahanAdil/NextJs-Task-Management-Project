import mongoose from "mongoose";

const paymentsSchema = new mongoose.Schema({
    userID: { type: String, required: true, unique: true },
    availableBalance: { type: String },
    pendingAmount: { type: String },
    totalWithdrawal: { type: String }
}, { timestamps: true })

export const paymentsModel = mongoose.models.payments || mongoose.model("payments", paymentsSchema)