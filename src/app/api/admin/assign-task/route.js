import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { notificationsModel } from "@/lib/models/notifications";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect()
        const { privateTask, notification } = await req.json()

        await Promise.all([
            userTasksModel.create(privateTask),
            notificationsModel.create(notification)
        ])

        return NextResponse.json({ message: "Task assigned successfully!" }, { status: 201 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}