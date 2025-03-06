import dbConnect from "@/lib/db";
import { publicTasksModel } from "@/lib/models/publicTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const taskID = searchParams.get("taskID")

        const taskDetails = await publicTasksModel.findOne({ taskID })

        return NextResponse.json({ message: "Task fetched successfully!", taskDetails }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}