import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Skip middleware for connect page and API routes
  if (
    request.nextUrl.pathname === "/dashboard/connect" ||
    request.nextUrl.pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Check for session cookie (next-auth v5 uses different cookie names)
  const sessionCookie =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Protected routes require session
  if (request.nextUrl.pathname.startsWith("/dashboard") && !sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard/connect", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
