import dbConnect from "@/lib/db";
import { publicTasksModel } from "@/lib/models/publicTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 15
        const skip = (page - 1) * limit

        const publicTasks = await publicTasksModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalPublicTasks = await publicTasksModel.countDocuments()

        return NextResponse.json({ message: "Tasks fetched successfully!", publicTasks, totalPublicTasks }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}