import dbConnect from "@/lib/db";
import { notificationsModel } from "@/lib/models/notifications";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await dbConnect()
        const { userID } = await req.json()

        await notificationsModel.updateMany({ recipient: userID, status: "unread" }, { status: "read" })

        return NextResponse.json({ message: "Notifications marked as read successfully!" }, { status: 202 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}