import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/userDashboard"];
const adminRoutes = ["/dashboard"];
const guestRoutes = ["/login", "/register"];

function decodeJWT(token: string) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = Buffer.from(base64Payload, "base64").toString("utf-8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

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

  // Admin route এ role check
  if (isAdminRoute && accessToken) {
    const payload = decodeJWT(accessToken);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Login/Register এ token থাকলে → role দেখে redirect
  if (isGuestRoute && accessToken) {
    const payload = decodeJWT(accessToken);
    if (payload?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
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