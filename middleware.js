import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  console.log('middleware');

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Tüm isteklerde çalıştır
};

