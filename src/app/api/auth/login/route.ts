import { NextRequest, NextResponse } from "next/server";
import { createSessionCookieString } from "@/libs/auth-cookies";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessToken, authCenter, profile } = body;

    if (!accessToken || !authCenter) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sessionData = { accessToken, authCenter, profile };
    const cookieString = createSessionCookieString(sessionData);

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", cookieString);

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
