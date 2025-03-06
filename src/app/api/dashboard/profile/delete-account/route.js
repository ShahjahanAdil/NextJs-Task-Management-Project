import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userID = searchParams.get('userID');
        
        await authModel.findOneAndDelete({ userID })

        return NextResponse.json({ message: "User deleted successfully!" }, { status: 203 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}