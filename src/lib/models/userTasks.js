import mongoose from "mongoose";

const userTasksSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    userEmail: { type: String, required: true },
    adminID: { type: String, required: true },
    adminEmail: { type: String, required: true },
    adminName: { type: String, required: true },
    taskID: { type: String, required: true },
    taskTitle: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskPrice: { type: String, required: true },
    taskPoints: { type: String, required: true },
    taskStatus: { type: String },
    taskMode: { type: String }
}, { timestamps: true })

export const userTasksModel = mongoose.models.usertasks || mongoose.model("usertasks", userTasksSchema)