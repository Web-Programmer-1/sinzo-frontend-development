import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/dashboard", "/admin"];
const guestRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isGuestRoute = guestRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isGuestRoute && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};