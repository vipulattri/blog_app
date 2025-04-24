import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB, { getFileUsers, isUsingMongo } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return NextResponse.json({ success: false, message: 'Username and password are required' }, { status: 400 });
    }

    // Try to connect to MongoDB first
    const db = await connectDB();
    console.log('MongoDB connection status:', !!db);
    console.log('MongoDB URI being used:', process.env.MONGODB_URI);

    let user;
    let userDoc;

    const usingMongo = isUsingMongo();
    console.log(`Login: Using ${usingMongo ? 'MongoDB' : 'file-based storage'} for authentication`);

    if (usingMongo) {
      // Use MongoDB - explicitly include the password field
      console.log('Looking for user in MongoDB with username:', username);
      userDoc = await User.findOne({ username }).select('+password');
      
      if (userDoc) {
        // Convert to plain object and ensure password is included
        user = userDoc.toObject();
        console.log('MongoDB user found:', username);
        console.log('User document ID:', user._id);
        console.log('Password field exists:', !!user.password);
        
        // Debug - check if password is included (don't log actual password)
        if (!user.password) {
          console.error('Password field is missing from MongoDB user object');
          return NextResponse.json({ 
            success: false, 
            message: 'Authentication error - contact administrator' 
          }, { status: 500 });
        }
      } else {
        console.log('User not found in MongoDB');
        user = null;
      }
    } else {
      // Use file-based storage as fallback
      const users = getFileUsers();
      userDoc = users.find((u: any) => u.username === username);
      user = userDoc || null;
      
      if (user) {
        console.log('File storage user found:', username);
      }
    }

    if (!user) {
      console.log(`User not found: ${username}`);
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }

    // Debug - check password structure before comparing
    if (!user.password) {
      console.error('User password is undefined or null');
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication error - contact administrator' 
      }, { status: 500 });
    }

    // Verify password
    try {
      console.log('Comparing provided password with stored hash');
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match result:', isMatch);
      
      if (!isMatch) {
        console.log(`Password mismatch for user: ${username}`);
        return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
      }
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return NextResponse.json({ 
        success: false, 
        message: 'Authentication error - contact administrator' 
      }, { status: 500 });
    }

    // Create JWT token with proper user ID
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    // Ensure we have a proper ID string
    const userId = user._id?.toString() || user._id;
    console.log('User ID for token:', userId);
    
    // Create payload with admin flag
    const payload = { 
      id: userId, 
      username: user.username,
      isAdmin: user.isAdmin || false 
    };
    
    console.log('Creating token with payload:', payload);
    
    const token = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Create response with cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: userId,
        username: user.username,
        isAdmin: user.isAdmin || false
      }
    });

    // Set cookie with token
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/'
    });

    console.log(`User ${username} logged in successfully`);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred during login', 
      error: error.message 
    }, { status: 500 });
  }
} 