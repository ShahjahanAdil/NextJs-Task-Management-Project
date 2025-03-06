import dbConnect from "@/lib/db";
import { withdrawsModel } from "@/lib/models/withdraws";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 15
        const skip = (page - 1) * limit

        const totalUserWithdraws = await withdrawsModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalWithdraws = await withdrawsModel.countDocuments()

        return NextResponse.json({ message: "Withdraws fetched successfully!", totalUserWithdraws, totalWithdraws }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}