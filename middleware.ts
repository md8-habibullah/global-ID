import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Intercept POST requests that carry a `Next-Action` header (Server Action calls).
 * This app has no server actions, so any such request is invalid — likely from a
 * stale client, old deployment, or external probe. Without this guard, Next.js
 * returns a text/plain error body which the RSC parser cannot handle, causing:
 *   InvariantError: Expected RSC response, got text/plain.
 */
export function middleware(request: NextRequest) {
  if (
    request.method === "POST" &&
    request.headers.has("next-action")
  ) {
    return NextResponse.json(
      { error: "No server actions are registered on this site." },
      { status: 400 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - /api/*        (API routes handle their own logic)
     * - /monitoring   (Sentry tunnel route)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|monitoring).*)",
  ],
};