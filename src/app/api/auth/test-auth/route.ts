import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB, { getFileUsers, isUsingMongo } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required'
      }, { status: 400 });
    }
    
    await connectDB();
    
    let user;
    let storedHash = '';
    
    // Try MongoDB first
    if (isUsingMongo()) {
      user = await User.findOne({ username });
      if (user) {
        storedHash = user.password;
      }
    }
    
    // Fall back to file-based storage
    if (!user) {
      const users = getFileUsers();
      user = users.find(u => u.username === username);
      if (user) {
        storedHash = user.password;
      }
    }
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 401 });
    }
    
    // Test the password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, storedHash);
    
    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(password, 10);
    
    return NextResponse.json({
      success: isPasswordValid,
      message: isPasswordValid ? 'Password is valid' : 'Password is invalid',
      debug: {
        storedHash,
        newlyGeneratedHash: newHash,
        doHashesDiffer: storedHash !== newHash, // bcrypt hashes are always different even for same password
        passwordsMatch: isPasswordValid
      }
    });
    
  } catch (error) {
    console.error('Test auth error:', error);
    const err = error as Error;
    return NextResponse.json({
      success: false,
      message: 'Authentication test error',
      error: err.message
    }, { status: 500 });
  }
} 