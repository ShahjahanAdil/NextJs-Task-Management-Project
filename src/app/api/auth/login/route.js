import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";
import bcrpyt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req) {
	try {
		await dbConnect();

		const { email, password } = await req.json()
		const user = await authModel.findOne({ email })

		if (!user) {
			return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
		}

		const matchedPassword = await bcrpyt.compare(password, user.password)

		if (matchedPassword) {
			const { userID, roles } = user
			const token = jwt.sign({ userID, roles }, "secret-key", { expiresIn: '1d' })

			return NextResponse.json({ message: "Login successful!", token, user }, { status: 200 })
		} else {
			return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
		}

	} catch (error) {
		console.error("Database connection error:", error.message);
		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}