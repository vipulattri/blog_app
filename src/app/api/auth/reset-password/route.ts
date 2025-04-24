import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB, { getFileUsers, saveFileUsers, isUsingMongo } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { username, newPassword } = await request.json();

    if (!username || !newPassword) {
      return NextResponse.json({ 
        success: false, 
        message: 'Username and new password are required' 
      }, { status: 400 });
    }

    // Password validation
    if (newPassword.length < 6) {
      return NextResponse.json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Try to connect to MongoDB first
    await connectDB();

    // Check if user exists
    let userExists = false;
    let user;

    if (isUsingMongo()) {
      console.log('Reset Password: Using MongoDB');
      user = await User.findOne({ username });
      userExists = !!user;
    } else {
      console.log('Reset Password: Using file-based storage');
      const users = getFileUsers();
      user = users.find((u: any) => u.username === username);
      userExists = !!user;
    }

    if (!userExists) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    if (isUsingMongo()) {
      await User.updateOne(
        { username },
        { $set: { password: hashedPassword } }
      );
      console.log(`User ${username} password updated in MongoDB`);
    } else {
      const users = getFileUsers();
      const updatedUsers = users.map((u: any) => {
        if (u.username === username) {
          return {
            ...u,
            password: hashedPassword,
            updatedAt: new Date()
          };
        }
        return u;
      });
      saveFileUsers(updatedUsers);
      console.log(`User ${username} password updated in file storage`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'An error occurred during password reset', 
      error: error.message 
    }, { status: 500 });
  }
} 