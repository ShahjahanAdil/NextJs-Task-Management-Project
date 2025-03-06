import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const users = await authModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalUsers = await authModel.countDocuments()

        return NextResponse.json({ message: "Users fetched successfully!", users, totalUsers }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}