import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Check if any user exists
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      // Users already exist
      return NextResponse.json({
        success: true,
        message: 'MongoDB already initialized with users',
        userCount
      });
    }
    
    // Create default admin user
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const defaultUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username: 'Vipul',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await defaultUser.save();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB initialized with default admin user',
      user: {
        id: defaultUser._id,
        username: defaultUser.username,
        isAdmin: defaultUser.isAdmin
      }
    });
    
  } catch (error) {
    console.error('MongoDB setup error:', error);
    const err = error as Error;
    return NextResponse.json({
      success: false,
      message: 'Error setting up MongoDB',
      error: err.message
    }, { status: 500 });
  }
} 