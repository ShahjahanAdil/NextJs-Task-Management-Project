import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")
        const failedTs = await userTasksModel.find({ userID, taskStatus: "rejected" }).sort({ updatedAt: -1 })

        return NextResponse.json({ message: "Your tasks fetched successfully!", failedTs }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}