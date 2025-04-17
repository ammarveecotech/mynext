import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Extend the middleware with custom logic
export default withAuth(
  function middleware(req: NextRequest) {
    // Return NextResponse.next() to allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      // If this callback returns true, the request will be allowed
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/landing",
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    "/personal-information",
    "/current-status",
    "/preferences",
    "/profile-picture",
    "/overview",
  ],
}; 