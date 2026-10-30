import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware de protección de rutas (web con backend habilitado).
 * Si las credenciales de Supabase no están definidas, pasa de largo (modo dev/sin backend).
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) return NextResponse.next();

  // En este punto tendríamos backend real; protege /account y /admin *
  const protectedPaths = ["/account", "/admin"];
  const isProtected = protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p));

  const hasAuthCookie = request.cookies.has("sb-access-token") || request.cookies.has("sb:token");
  if (isProtected && !hasAuthCookie) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };