import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("session")?.value;

    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");


    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
}

// Protect these routes
export const config = {
    matcher: [
        "/tickets/:path*",
    ],
};
