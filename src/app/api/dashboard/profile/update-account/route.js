import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await dbConnect();

        const updatedUser = await req.json()
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get('userID')

        await authModel.findOneAndUpdate({ userID }, updatedUser, { new: true })

        return NextResponse.json({ message: "User updated successfully!" }, { status: 203 })
    } catch (error) {
        console.error("Database connection error:", error.message)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}