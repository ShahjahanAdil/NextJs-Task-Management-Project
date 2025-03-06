import dbConnect from "@/lib/db";
import { submittedTasksModel } from "@/lib/models/submittedTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const submittedTasks = await submittedTasksModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalSubmittedTasks = await submittedTasksModel.countDocuments()

        return NextResponse.json({ message: "Users fetched successfully!", submittedTasks, totalSubmittedTasks }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}