import dbConnect from "@/lib/db";
import { withdrawsModel } from "@/lib/models/withdraws";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const userWithdraws = await withdrawsModel.find({ userID }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalWithdraws = await withdrawsModel.countDocuments({ userID })

        return NextResponse.json({ message: "Withdraws fetched successfully!", userWithdraws, totalWithdraws }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}