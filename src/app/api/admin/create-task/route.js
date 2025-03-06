import dbConnect from "@/lib/db";
import { publicTasksModel } from "@/lib/models/publicTasks";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const newTask = await req.json()
        await publicTasksModel.create(newTask)

        return NextResponse.json({ message: "Task created successfully!" }, { status: 201 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}