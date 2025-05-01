import { NextResponse } from 'next/server';

// Define which routes require authentication
const protectedRoutes = ['/admin', '/create', '/edit'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware processing: ${pathname}`);

  // Only handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // For admin routes, we'll let the client-side handle the authentication
    // The admin page component will check auth and redirect if needed
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
  }

  // For all other routes, continue the request
  return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  matcher: [
    '/admin/:path*', 
    '/create/:path*', 
    '/edit/:path*',
  ]
}; 