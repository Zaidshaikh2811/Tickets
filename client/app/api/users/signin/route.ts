import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log(body);


        const apiRes = await fetch("http://auth-srv:3000/api/users/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await apiRes.json();

        // Forward response including cookies
        const response = NextResponse.json(data, { status: apiRes.status });

        // Copy cookies from auth service
        const setCookie = apiRes.headers.get("set-cookie");
        if (setCookie) {
            response.headers.set("set-cookie", setCookie);
        }

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}