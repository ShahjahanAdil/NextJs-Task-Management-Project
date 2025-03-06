import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { verfiyToken } from "@/lib/middlewares/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
    const authResponse = verfiyToken(req);
    if (authResponse) {
        return authResponse;
    }

    try {
        await dbConnect();

        const userID = req.userID
        const user = await authModel.findOne({ userID })

        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}