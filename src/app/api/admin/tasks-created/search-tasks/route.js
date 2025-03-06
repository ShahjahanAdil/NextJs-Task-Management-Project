import dbConnect from "@/lib/db";
import { publicTasksModel } from "@/lib/models/publicTasks";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const searchTasks = searchParams.get("searchTasks")

        const tasks = await publicTasksModel.find({ taskTitle: { $regex: searchTasks, $options: "i" } })

        if (tasks.length === 0) {
            return NextResponse.json({ message: "No matching tasks found!" }, { status: 404 });
        }

        return NextResponse.json({ message: "Task fetched successfully!", tasks }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: "Internal Server Error!" }, { status: 500 })
    }
}