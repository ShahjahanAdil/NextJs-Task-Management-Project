import { NextResponse } from "next/server"
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode("secret-key");

async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error("Token verification error:", error.message);
        return null;
    }
}

export async function middleware(req) {
    const urlPath = req.nextUrl.pathname;
    const token = req.cookies.get("jwtTask")?.value;

    if (!token) {
        if (urlPath.startsWith("/dashboard") && !token) {
            console.log("User is not authorized, redirecting to unauthorized.");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        if (urlPath.startsWith("/admin") && !token) {
            console.log("User is not authorized, redirecting to unauthorized.");
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    const isAdmin = decoded.roles?.find(role => role.toLowerCase().includes("admin"))
    if (urlPath.startsWith("/admin") && !isAdmin) {
        console.log("User is not an admin, redirecting to unauthorized.");
        return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};