import mongoose from "mongoose";

const publicTasksSchema = new mongoose.Schema({
    adminID: { type: String, required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    taskID: { type: String, required: true, unique: true },
    taskTitle: { type: String, required: true },
    taskDescription: { type: String, required: true },
    taskPrice: { type: String, required: true },
    taskPoints: { type: String, required: true },
    taskStatus: { type: String },
    taskMode: { type: String }
}, { timestamps: true })

export const publicTasksModel = mongoose.models.publictasks || mongoose.model("publictasks", publicTasksSchema)