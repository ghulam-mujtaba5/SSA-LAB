import { NextResponse } from "next/server";
import { loginRateLimiter } from "./lib/rate-limiter";
import { getToken } from "next-auth/jwt";

export async function proxy(req) {
  const { pathname, search } = req.nextUrl;

  // 1) Apply rate limiting only to the credentials sign-in API route
  if (pathname === "/api/auth/callback/credentials" && req.method === "POST") {
    try {
      await new Promise((resolve, reject) => {
        loginRateLimiter(req, NextResponse.next(), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      return NextResponse.next();
    } catch (error) {
      return new NextResponse("Too many requests.", { status: 429 });
    }
  }

  // 2) Protect admin pages and admin APIs with NextAuth JWT
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isLoginPage = pathname === "/admin/login";

  if ((isAdminPage && !isLoginPage) || isAdminApi) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // For API requests, return JSON 401 instead of redirecting to HTML
      if (isAdminApi) {
        return new NextResponse(
          JSON.stringify({ message: "Unauthorized" }),
          { status: 401, headers: { "content-type": "application/json" } }
        );
      }

      // Redirect unauthenticated page requests to login with a callback URL
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      // Preserve where the user wanted to go
      const callbackUrl = encodeURIComponent(pathname + (search || ""));
      loginUrl.search = `?callbackUrl=${callbackUrl}`;
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/callback/credentials",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
