import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")
        const filter = searchParams.get("filter")
        console.log(filter);
        
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 20
        const skip = (page - 1) * limit

        const yourTasks = await userTasksModel.find({ userID, taskStatus: filter }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalTasks = await userTasksModel.countDocuments({ userID, taskStatus: filter })

        return NextResponse.json({ message: "Your tasks fetched successfully!", yourTasks, totalTasks }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}