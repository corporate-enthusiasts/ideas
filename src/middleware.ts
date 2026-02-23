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

  // Allow all GET requests through (read-only guest access)
  if (request.method === "GET") {
    return NextResponse.next();
  }

  // Write operations (POST/PUT/DELETE) require auth
  const authCookie = request.cookies.get("auth");
  if (!authCookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
