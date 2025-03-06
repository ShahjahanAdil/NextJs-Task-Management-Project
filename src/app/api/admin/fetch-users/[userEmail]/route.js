import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        await dbConnect()
        const { params } = context
        const { userEmail } = params

        const user = await authModel.findOne({ email: userEmail })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "User fetched successfully!", user }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}