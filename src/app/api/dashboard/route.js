import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { publicTasksModel } from "@/lib/models/publicTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")

        const userTCount = await userTasksModel.countDocuments({ userID })
        const completedTCount = await userTasksModel.countDocuments({ userID, taskStatus: "completed" })
        const pendingTCount = await userTasksModel.countDocuments({ userID, taskStatus: "pending" })
        const failedTCount = await userTasksModel.countDocuments({ userID, taskStatus: "rejected" })
        const publicTCount = await publicTasksModel.countDocuments()

        return NextResponse.json({ message: "Your tasks fetched successfully!", userTCount, completedTCount, pendingTCount, failedTCount, publicTCount }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: "Internal server error. Please try again later!" }, { status: 500 })
    }
}