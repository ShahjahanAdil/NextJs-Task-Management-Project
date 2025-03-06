import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const acceptedTask = await req.json()
        const isTaskAddedAlready = await userTasksModel.findOne({ taskID: acceptedTask.taskID, userID: acceptedTask.userID })
        if (isTaskAddedAlready) {
            return NextResponse.json({ message: "Task is already present in your task list!" }, { status: 400 })
        }

        await userTasksModel.create(acceptedTask)

        return NextResponse.json({ message: "Task added to your account successfully!" }, { status: 201 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}