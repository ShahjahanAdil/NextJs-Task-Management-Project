import dbConnect from "@/lib/db";
import { notificationsModel } from "@/lib/models/notifications";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")

        await notificationsModel.deleteMany({ recipient: userID })

        return NextResponse.json({ message: "Notifications cleared successfully!" }, { status: 203 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}