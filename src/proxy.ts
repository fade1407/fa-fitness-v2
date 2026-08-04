import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const publicPaths = ["/login", "/offline"];
export async function proxy(request: NextRequest) {
  const { response, user, configured } = await updateSession(request);
  if (!configured) return response;
  const { pathname } = request.nextUrl;
  if (!user && !publicPaths.some((path) => pathname.startsWith(path))) return NextResponse.redirect(new URL("/login", request.url));
  if (user && pathname.startsWith("/login")) return NextResponse.redirect(new URL("/dashboard", request.url));
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sw.js|manifest.webmanifest).*)"] };
