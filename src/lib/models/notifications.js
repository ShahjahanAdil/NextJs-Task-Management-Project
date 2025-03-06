import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
    recipient: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: String }
}, { timestamps: true })

export const notificationsModel = mongoose.models.notifications || mongoose.model("notifications", notificationsSchema)