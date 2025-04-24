import { NextRequest, NextResponse } from 'next/server';
import connectDB, { getFileUsers, isUsingMongo } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Only allow this in development mode
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }
    
    console.log('MongoDB URI from env:', process.env.MONGODB_URI);
    
    // Connect to both data sources
    const dbConnection = await connectDB();
    console.log('MongoDB connected:', !!dbConnection);
    
    const mongoUsers = isUsingMongo() 
      ? await User.find().select('-password').lean() 
      : [];
      
    console.log('MongoDB users count:', mongoUsers.length);
    
    const fileUsers = getFileUsers().map(user => ({
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    }));
    
    return NextResponse.json({
      usingMongo: isUsingMongo(),
      mongodb: {
        connected: !!dbConnection,
        users: mongoUsers
      },
      fileStorage: {
        users: fileUsers
      }
    });
  } catch (error: any) {
    console.error('Debug users error:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
} 