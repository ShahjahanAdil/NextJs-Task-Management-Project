import dbConnect from "@/lib/db"
import { submittedTasksModel } from "@/lib/models/submittedTasks"
import { userTasksModel } from "@/lib/models/userTasks"
import { NextResponse } from "next/server"

export async function PATCH(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const taskID = searchParams.get("taskID")

        await Promise.all([
            submittedTasksModel.findOneAndUpdate({ taskID }, { taskStatus: "rejected" }, { new: true }),
            userTasksModel.findOneAndUpdate({ taskID }, { taskStatus: "rejected" }, { new: true })
        ])

        return NextResponse.json({ message: "Task rejected!" }, { status: 202 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}