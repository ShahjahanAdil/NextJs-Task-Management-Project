import dbConnect from "@/lib/db";
import { userTasksModel } from "@/lib/models/userTasks";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const assignedTs = await userTasksModel.find({ taskMode: "private" }).sort({ createdAt: -1 })

        return NextResponse.json({ message: "Assigned tasks fetched successfully!", assignedTs }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}