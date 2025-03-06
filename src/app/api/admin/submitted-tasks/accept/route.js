import dbConnect from "@/lib/db"
import { authModel } from "@/lib/models/auth"
import { paymentsModel } from "@/lib/models/payments"
import { submittedTasksModel } from "@/lib/models/submittedTasks"
import { userTasksModel } from "@/lib/models/userTasks"
import { NextResponse } from "next/server"

export async function PATCH(req) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const taskID = searchParams.get("taskID")
        const userID = searchParams.get("userID")
        const updatedTask = await req.json()

        const userPaymentDets = await paymentsModel.findOne({ userID })
        if (!userPaymentDets) {
            return NextResponse.json({ message: "Something went wrong. Please try again!" }, { status: 404 })
        }

        const newBalance = (parseFloat(userPaymentDets.availableBalance) + parseFloat(updatedTask.taskPrice)).toString()
        const taskPoints = parseFloat(updatedTask.taskPoints)

        const updateResults = await Promise.all([
            authModel.findOneAndUpdate({ userID }, { $inc: { points: taskPoints } }, { new: true }),
            paymentsModel.findOneAndUpdate({ userID }, { availableBalance: newBalance }, { new: true }),
            submittedTasksModel.findOneAndUpdate({ taskID }, { taskStatus: "completed" }, { new: true }),
            userTasksModel.findOneAndUpdate({ taskID }, { taskStatus: "completed" }, { new: true })
        ])

        if (updateResults.includes(null)) {
            return NextResponse.json({ message: "Failed to update some records" }, { status: 500 })
        }

        return NextResponse.json({ message: "Task accepted!" }, { status: 202 })
    } catch (error) {
        console.error("Database connection error:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}