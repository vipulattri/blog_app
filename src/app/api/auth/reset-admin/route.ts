import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB, { getFileUsers, saveFileUsers, isUsingMongo } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // This is a special endpoint for deployment only - it should be removed or secured in production
    const { username = 'Vipul', password = '123456' } = await request.json();
    
    await connectDB();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let updated = false;
    
    // Update in MongoDB if connected
    if (isUsingMongo()) {
      const result = await User.findOneAndUpdate(
        { username: username },
        { password: hashedPassword, isAdmin: true },
        { upsert: true, new: true }
      );
      
      if (result) {
        updated = true;
      }
    }
    
    // Also update in file storage as a fallback
    const users = getFileUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex >= 0) {
      users[userIndex].password = hashedPassword;
      users[userIndex].isAdmin = true;
    } else {
      users.push({
        _id: require('mongoose').Types.ObjectId().toString(),
        username,
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    saveFileUsers(users);
    updated = true;
    
    return NextResponse.json({
      success: true,
      message: `Admin password reset for ${username}`,
      updated,
      hash: hashedPassword
    });
    
  } catch (error) {
    console.error('Admin reset error:', error);
    const err = error as Error;
    return NextResponse.json({
      success: false,
      message: 'Admin reset error',
      error: err.message
    }, { status: 500 });
  }
} 