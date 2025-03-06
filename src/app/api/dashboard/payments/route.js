import dbConnect from "@/lib/db";
import { paymentsModel } from "@/lib/models/payments";
import { withdrawsModel } from "@/lib/models/withdraws";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")
        const userAccountDets = await paymentsModel.findOne({ userID })

        return NextResponse.json({ message: "Your account fetched successfully!", userAccountDets }, { status: 200 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const newWithdraw = await req.json()

        const userAccountDets = await paymentsModel.findOne({ userID: newWithdraw.userID })
        if (!userAccountDets) {
            return NextResponse.json({ message: "Something went wrong. Please try again!" }, { status: 404 })
        }

        const updateResults = await Promise.all([
            paymentsModel.findOneAndUpdate(
                { userID: newWithdraw.userID },
                {
                    availableBalance: "0",
                    pendingAmount: (parseFloat(userAccountDets?.pendingAmount || "0") + parseFloat(newWithdraw.withdrawAmount)).toString()
                },
                { new: true }
            ),
            withdrawsModel.create(newWithdraw)
        ])

        if (updateResults.includes(null)) {
            return NextResponse.json({ message: "Failed to update some records" }, { status: 500 })
        }

        return NextResponse.json({ message: "Your withdraw has been requested!" }, { status: 201 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: "Something went wrong. Please try again!" }, { status: 500 })
    }
}