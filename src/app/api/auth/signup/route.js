import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";
import bcrpyt from "bcrypt"
import { paymentsModel } from "@/lib/models/payments";

export async function POST(req) {
    try {
        await dbConnect();

        const newUserData = await req.json()

        const { userID, email, password } = newUserData
        const userFound = await authModel.findOne({ email })
        if (userFound) {
            return NextResponse.json({ message: "User already exists!" }, { status: 403 })
        }

        const hashedPassword = await bcrpyt.hash(password, 10)

        const user = { ...newUserData, password: hashedPassword }
        await Promise.all([
            authModel.create(user),
            paymentsModel.create({
                userID,
                availableBalance: "0",
                pendingAmount: "0",
                totalWithdrawal: "0"
            })
        ])

        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}