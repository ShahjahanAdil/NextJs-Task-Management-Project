import mongoose from "mongoose";

const withdrawsSchema = new mongoose.Schema({
    withdrawID: { type: String, required: true },
    userID: { type: String, required: true },
    userEmail: { type: String, required: true },
    withdrawStatus: { type: String },
    withdrawAmount: { type: Number },
    withdrawalAccount: { type: String, required: true },
    withdrawalAccountNumber: { type: String, required: true },
}, { timestamps: true })

export const withdrawsModel = mongoose.models.withdraws || mongoose.model("withdraws", withdrawsSchema)