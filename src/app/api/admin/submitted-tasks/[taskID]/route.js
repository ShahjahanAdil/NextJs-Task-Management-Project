import dbConnect from "@/lib/db";
import { submittedTasksModel } from "@/lib/models/submittedTasks";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        await dbConnect()
        const { params } = context
        const { taskID } = params

        const submittedTask = await submittedTasksModel.findOne({ taskID })
        if (!submittedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Task fetched successfully!", submittedTask }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}