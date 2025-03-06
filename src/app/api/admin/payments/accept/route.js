import dbConnect from "@/lib/db";
import { paymentsModel } from "@/lib/models/payments";
import { withdrawsModel } from "@/lib/models/withdraws";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url)
        const withdrawID = searchParams.get("withdrawID")
        const userID = searchParams.get("userID")
        const withdrawAmount = searchParams.get("withdrawAmount")

        const userPaymentDets = await paymentsModel.findOne({ userID })
        if (!userPaymentDets) {
            return NextResponse.json({ message: "Something went wrong. Please try again!" }, { status: 404 })
        }

        const withdrawDets = await withdrawsModel.findOne({ withdrawID })
        if (withdrawDets.withdrawStatus === "completed") {
            return NextResponse.json({ message: "Withdraw request already completed!" }, { status: 400 });
        }

        if (userPaymentDets.pendingAmount < withdrawAmount) {
            return NextResponse.json({ message: "Insufficient pending amount!" }, { status: 400 });
        }

        await Promise.all([
            paymentsModel.findOneAndUpdate(
                { userID, pendingAmount: { $gte: 0 } },
                {
                    pendingAmount: (parseFloat(userPaymentDets.pendingAmount) - parseFloat(withdrawAmount)).toString(),
                    totalWithdrawal: (parseFloat(userPaymentDets.totalWithdrawal) + parseFloat(withdrawAmount)).toString()
                },
                { new: true }
            ),
            withdrawsModel.findOneAndUpdate({ withdrawID }, { withdrawStatus: "completed" }, { new: true })
        ])

        return NextResponse.json({ message: "Withdrawal request completed!" }, { status: 202 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}