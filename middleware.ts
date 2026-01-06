import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookieString } from "./src/libs/auth-cookies";
import { RouteEnum } from "@/app/constants/enum/route.enum";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieHeader = request.headers.get("cookie") || "";
  const session = getSessionFromCookieString(cookieHeader);

  // Public routes that don't require authentication
  const isPublicRoute = pathname === RouteEnum.LOGIN;

  // Protected routes
  const isProtectedRoute =
    pathname === RouteEnum.HOME || pathname.startsWith(RouteEnum.MERCHANT_LIST);

  // If user is authenticated and trying to access login, redirect to home
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not authenticated and trying to access protected route, redirect to login
  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
