import dbConnect from "@/lib/db";
import { notificationsModel } from "@/lib/models/notifications";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")
        const page = parseInt(searchParams.get("page")) || 1
        const limit = 15
        const skip = (page - 1) * limit

        const userNotifications = await notificationsModel.find({ recipient: userID }).sort({ createdAt: -1 }).skip(skip).limit(limit)
        const totalNotifications = await notificationsModel.countDocuments({ recipient: userID })

        return NextResponse.json({ message: "Notifications fetched successfully!", userNotifications, totalNotifications }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}