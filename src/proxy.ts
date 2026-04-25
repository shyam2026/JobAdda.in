import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Skip proxy for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Protected routes — require login
  const protectedRoutes = ['/dashboard', '/profile', '/resume', '/refer', '/notifications', '/jobs/applied'];
  const companyRoutes = ['/company/dashboard', '/company/jobs', '/company/applicants'];
  const adminRoutes = ['/admin'];

  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));
  const isCompany = companyRoutes.some(r => pathname.startsWith(r));
  const isAdmin = adminRoutes.some(r => pathname.startsWith(r));

  // req.auth contains the session in v5
  const session = req.auth;

  if ((isProtected || isCompany || isAdmin) && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/resume/:path*',
    '/refer/:path*',
    '/notifications/:path*',
    '/jobs/applied/:path*',
    '/company/dashboard/:path*',
    '/company/jobs/:path*',
    '/company/applicants/:path*',
    '/admin/:path*',
  ]
};
