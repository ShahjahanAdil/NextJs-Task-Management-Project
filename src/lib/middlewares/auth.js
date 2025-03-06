import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

export function verfiyToken(req) {
    const authHeader = req.headers.get("authorization")
    const token = authHeader.split(" ")[1]

    jwt.verify(token, "secret-key", (err, result) => {
        if (!err) {
            req.userID = result.userID
        }
        else {
            return NextResponse.json({ message: "Invalid token!" }, { status: 401 });
        }
    })
}