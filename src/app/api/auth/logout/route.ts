import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs'; // Force Node.js runtime instead of Edge

export async function POST() {
  try {
    // Determine environment
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? 'blog-app-ochre-delta-23.vercel.app' : undefined;
    
    // Clear the token cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: domain
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    console.error("Logout error:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'An error occurred during logout' 
      },
      { status: 500 }
    );
  }
} 