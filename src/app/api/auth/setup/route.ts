import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB, { isUsingMongo } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Only allow this in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({
        success: false,
        message: 'This endpoint is disabled in production mode'
      }, { status: 403 });
    }
    
    // Connect to MongoDB
    const db = await connectDB();
    
    if (!isUsingMongo()) {
      return NextResponse.json({
        success: false,
        message: 'MongoDB connection failed',
        usingMongo: false
      }, { status: 500 });
    }
    
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'Vipul' });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        userId: existingAdmin._id.toString()
      });
    }
    
    // Create default admin user
    // Password is '123456' - using the same hash that's in the file storage
    const defaultAdmin = {
      username: 'Vipul',
      password: '$2a$10$qnrH1ZrESzrC4.pNiKeqiuNEqmFpPMSVFj6REaLl8jv7CdyBYJ6r.',
      isAdmin: true
    };
    
    // Alternatively, hash the password fresh
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash('123456', salt);
    // defaultAdmin.password = hashedPassword;
    
    // Create user in MongoDB
    const newUser = await User.create(defaultAdmin);
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      userId: newUser._id.toString()
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to set up admin user',
      error: error.message
    }, { status: 500 });
  }
} 