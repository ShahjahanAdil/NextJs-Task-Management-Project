import dbConnect from "@/lib/db";
import { notificationsModel } from "@/lib/models/notifications";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")

        const userLimitedNotifications = await notificationsModel.find({ recipient: userID }).sort({ createdAt: -1 }).limit(3)

        return NextResponse.json({ message: "Notifications fetched successfully!", userLimitedNotifications }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}