import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB, { isUsingMongo, getFileUsers } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define interface for our token payload
interface TokenPayload {
  id: string;
  username: string;
  isAdmin: boolean;
  exp?: number;
  iat?: number;
}

// Define interface for file-based user
interface FileUser {
  _id: string;
  username: string;
  password: string;
  isAdmin: boolean;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'No token found'
      });
    }
    
    // Verify token
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error: unknown) {
      const jwtError = error as Error;
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid token',
        error: jwtError.message
      });
    }
    
    // Token is valid, check user exists
    await connectDB();
    
    let user;
    
    if (isUsingMongo()) {
      user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return NextResponse.json({
          authenticated: false,
          message: 'User not found in database',
          tokenInfo: {
            id: decoded.id,
            username: decoded.username,
            isAdmin: decoded.isAdmin,
            exp: decoded.exp
          }
        });
      }
      user = user.toObject();
    } else {
      const users = getFileUsers();
      user = users.find((u: FileUser) => u._id === decoded.id);
      if (!user) {
        return NextResponse.json({
          authenticated: false,
          message: 'User not found in file storage',
          tokenInfo: {
            id: decoded.id,
            username: decoded.username,
            isAdmin: decoded.isAdmin,
            exp: decoded.exp
          }
        });
      }
    }
    
    // User exists, return authentication info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        isAdmin: user.isAdmin
      },
      tokenInfo: {
        id: decoded.id,
        username: decoded.username,
        isAdmin: decoded.isAdmin,
        exp: decoded.exp
      }
    });
    
  } catch (error: unknown) {
    console.error('Debug auth error:', error);
    const err = error as Error;
    return NextResponse.json({
      authenticated: false,
      message: 'Error checking authentication',
      error: err.message
    });
  }
} 