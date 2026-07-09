import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/watchlist"];

// Routes only for unauthenticated users (redirect to home if already logged in)
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If trying to access a protected route without a token → redirect to login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname); // preserve intended destination
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and trying to access login/register → redirect home
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Tell Next.js which paths this middleware runs on
// Exclude static files, images, and Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
