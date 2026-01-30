import { NextResponse } from "next/server";
import { createDeleteCookieString } from "@/libs/auth-cookies";

export async function POST() {
  try {
    const cookieString = createDeleteCookieString();

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", cookieString);

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
