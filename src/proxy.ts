import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Skip API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Define route categories
  const isAdminPath = pathname.startsWith('/admin');
  const isCompanyPath = pathname.startsWith('/company');
  const isStudentPath = pathname.startsWith('/user');

  // Skip for public routes like login/register within portals
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  if (isAuthPage) return NextResponse.next();

  // Admin Protection
  if (isAdminPath && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Company Protection
  if (isCompanyPath && !session) {
    return NextResponse.redirect(new URL('/company/login', req.url));
  }

  // Student Protection
  if (isStudentPath && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/user/:path*',
    '/company/:path*',
    '/admin/:path*',
  ]
};
