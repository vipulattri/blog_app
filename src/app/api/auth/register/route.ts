import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB, { isUsingMongo, getFileUsers, saveFileUsers } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    let userExists = false;

    if (isUsingMongo()) {
      userExists = !!(await User.findOne({ username }));
    } else {
      const users = getFileUsers();
      userExists = users.some((user: any) => user.username === username);
    }

    if (userExists) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    let newUser;

    if (isUsingMongo()) {
      newUser = await User.create({
        username,
        password: hashedPassword,
        isAdmin: false, // New users are not admins by default
      });
    } else {
      const users = getFileUsers();
      newUser = {
        _id: Math.random().toString(36).substring(2, 15),
        username,
        password: hashedPassword,
        isAdmin: false,
      };
      users.push(newUser);
      saveFileUsers(users);
    }

    // Generate JWT token
    const userId = newUser._id.toString();
    const token = jwt.sign(
      { 
        id: userId,
        username: newUser.username,
        isAdmin: newUser.isAdmin 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Determine environment
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? 'blog-app-ochre-delta-23.vercel.app' : undefined;

    // Return token in cookie
    const response = NextResponse.json(
      { message: 'Registration successful' },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token', // Using 'token' to match login route
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      domain: domain
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 