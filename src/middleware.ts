import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/userDashboard"];
const adminRoutes = ["/dashboard"];
const guestRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isGuestRoute = guestRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if ((isProtectedRoute || isAdminRoute) && !accessToken) {
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
    "/userDashboard/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};