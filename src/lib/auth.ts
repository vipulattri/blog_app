import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../models/User';
import connectDB, { getFileUsers, isUsingMongo } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    console.log('getSession: Token exists:', !!token);
    
    if (!token) {
      return null;
    }
    
    const decoded = await verifyToken(token);
    
    if (!decoded) {
      console.log('getSession: Token verification failed');
      return null;
    }
    
    console.log('getSession: Token payload:', {
      id: decoded.id,
      username: decoded.username,
      isAdmin: decoded.isAdmin
    });
    
    // Try MongoDB first, regardless of isUsingMongo result
    try {
      const dbConnection = await connectDB(); // Ensure DB connection
      console.log('getSession: Looking up user in MongoDB');
      const user = await User.findById(decoded.id).select('-password');
      
      if (user) {
        console.log(`getSession: User found in MongoDB with id ${decoded.id}`);
        return {
          user: {
            id: user._id.toString(),
            username: user.username,
            isAdmin: user.isAdmin,
          },
        };
      } else {
        console.log(`getSession: User not found in MongoDB with id ${decoded.id}`);
      }
    } catch (mongoError: any) {
      console.log(`getSession: MongoDB lookup error: ${mongoError.message}`);
      // Continue to file lookup if MongoDB lookup fails
    }
    
    // Fall back to file-based storage if MongoDB lookup fails
    console.log('getSession: Falling back to file storage lookup');
    const users = getFileUsers();
    const user = users.find((u: any) => u._id === decoded.id);
    
    if (!user) {
      console.log(`getSession: User not found in file storage with id ${decoded.id}`);
      return null;
    }
    
    console.log(`getSession: User found in file storage: ${user.username}`);
    return {
      user: {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    let user;
    
    // Check if we're using MongoDB or file-based storage
    if (isUsingMongo()) {
      user = await User.findById(decoded.id);
    } else {
      // Use file-based user storage
      const users = getFileUsers();
      user = users.find((u: any) => u._id === decoded.id);
    }
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );
    }
    
    return { user };
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: 'Authentication error' },
      { status: 500 }
    );
  }
}

export async function requireAdmin(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    if (!authResult.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }
    
    return authResult;
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json(
      { success: false, message: 'Authentication error' },
      { status: 500 }
    );
  }
} 