import dbConnect from "@/lib/db";
import { publicTasksModel } from "@/lib/models/publicTasks";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const taskID = searchParams.get("taskID")
        await publicTasksModel.findOneAndDelete({ taskID })

        return NextResponse.json({ message: "Task deleted successfully!" }, { status: 203 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: "Something went wrong. Please try again!" }, { status: 500 })
    }
}