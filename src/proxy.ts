import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /services/[id] and /dashboard routes
  const isProtectedService = pathname.startsWith("/services/") && pathname !== "/services";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isProtectedService || isDashboard) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      const user = session?.user;
      if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Role check for dashboard
      if (pathname.startsWith("/dashboard/admin") && (user as any).role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard/customer", request.url));
      }
      if (pathname.startsWith("/dashboard/customer") && (user as any).role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:path+"],
};
