import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // If already authenticated and visiting login, redirect to home
  if (request.nextUrl.pathname === "/login") {
    const authCookie = request.cookies.get("auth");
    if (authCookie?.value) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Allow auth API without any auth
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Everything else requires auth
  const authCookie = request.cookies.get("auth");
  if (!authCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
