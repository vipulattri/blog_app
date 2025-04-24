import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define which routes require authentication
const protectedRoutes = ['/admin', '/create', '/edit'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware processing: ${pathname}`);

  // Only handle protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;
    
    // Debug token info
    console.log(`Token exists: ${!!token}`);
    
    // No token exists, redirect to login
    if (!token) {
      console.log(`Redirecting to login: no token found for protected route ${pathname}`);
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Verify token
    try {
      // JWT secret must match the one used in API routes
      const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      
      // Verify token and get payload
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      console.log('Token payload:', {
        id: payload.id,
        username: payload.username,
        isAdmin: payload.isAdmin,
        exp: payload.exp
      });
      
      // Check for admin routes
      if (pathname.startsWith('/admin')) {
        // Convert to boolean to handle string values like "true" or undefined
        const isAdmin = payload.isAdmin === true || payload.isAdmin === "true";
        
        if (!isAdmin) {
          console.log('Non-admin user tried to access admin area:', payload.username);
          const url = new URL('/', request.url);
          return NextResponse.redirect(url);
        }
        
        console.log(`Admin access granted for user: ${payload.username}`);
      }
      
      // Valid token and authorization - continue
      console.log(`Valid token for user: ${payload.username || 'unknown'}`);
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error);
      // Invalid token, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
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