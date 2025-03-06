import dbConnect from "@/lib/db";
import { notificationsModel } from "@/lib/models/notifications";
import { submittedTasksModel } from "@/lib/models/submittedTasks";
import { userTasksModel } from "@/lib/models/userTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)
        const taskID = searchParams.get("taskID")

        const taskDetails = await userTasksModel.findOne({ taskID })

        return NextResponse.json({ message: "Task fetched successfully!", taskDetails }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        await dbConnect()

        const { taskToSubmit, notification } = await req.json()
        const taskID = taskToSubmit.taskID

        const isTaskSubmitted = await submittedTasksModel.findOne({ taskID })
        if (isTaskSubmitted) {
            return NextResponse.json({ message: "Task already submitted!" }, { status: 201 })
        }

        await Promise.all([
            submittedTasksModel.create(taskToSubmit),
            notificationsModel.create(notification)
        ])

        return NextResponse.json({ message: "Task submitted to admin!" }, { status: 201 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}