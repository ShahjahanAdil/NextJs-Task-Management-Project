import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")
        const taskID = searchParams.get("taskID")
        await userTasksModel.findOneAndDelete({ userID, taskID })

        return NextResponse.json({ message: "Task deleted successfully!" }, { status: 203 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: "Something went wrong. Please try again!" }, { status: 500 })
    }
}