import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect()
        const users = await authModel.find().sort({ points: -1 }).limit(3)

        return NextResponse.json({ message: "Top User fetched successfully!", users }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}