import dbConnect from "@/lib/db";
import { authModel } from "@/lib/models/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req) {
	try {
		await dbConnect();
		console.log("Connected to DB");

		const { email, password } = await req.json()
		console.log("Received Login Request:", { email });

		const user = await authModel.findOne({ email })

		if (!user) {
			return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
		}

		console.log("User found, comparing password...");
		const matchedPassword = await bcrypt.compare(password, user.password)

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