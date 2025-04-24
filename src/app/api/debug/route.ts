import { NextResponse } from 'next/server';
import connectDB, { isUsingMongo } from '@/lib/db';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Debug information object
    const debugInfo = {
      environment: {
        VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
        NODE_ENV: process.env.NODE_ENV || 'not set',
        MONGODB_URI: process.env.MONGODB_URI ? 'set (hidden for security)' : 'not set'
      },
      mongodb: {
        connection: 'not attempted yet',
        isUsingMongo: isUsingMongo(),
        connectionState: 'unknown'
      },
      blogs: {
        count: 0,
        retrieval: 'not attempted',
        sample: null as any
      },
      timing: {
        start: Date.now(),
        connection: 0,
        query: 0,
        total: 0
      }
    };

    // Step 1: Try to connect to MongoDB
    try {
      const startConnection = Date.now();
      const db = await connectDB();
      debugInfo.timing.connection = Date.now() - startConnection;
      
      if (db) {
        debugInfo.mongodb.connection = 'successful';
        debugInfo.mongodb.connectionState = mongoose.connection.readyState === 1 ? 'connected' : 'not connected';
      } else {
        debugInfo.mongodb.connection = 'failed';
      }
    } catch (error) {
      const err = error as Error;
      debugInfo.mongodb.connection = `error: ${err.message}`;
    }

    // Step 2: Try to get blogs from MongoDB
    if (debugInfo.mongodb.connection === 'successful') {
      try {
        const startQuery = Date.now();
        const blogs = await Blog.find({}).lean();
        debugInfo.timing.query = Date.now() - startQuery;
        
        debugInfo.blogs.count = blogs.length;
        debugInfo.blogs.retrieval = 'successful';
        
        // Add a sample blog if available (but hide sensitive info)
        if (blogs.length > 0) {
          const sampleBlog = { ...blogs[0] };
          if (sampleBlog._id) {
            sampleBlog._id = sampleBlog._id.toString();
          }
          debugInfo.blogs.sample = sampleBlog;
        }
      } catch (error) {
        const err = error as Error;
        debugInfo.blogs.retrieval = `error: ${err.message}`;
      }
    }

    // Calculate total time
    debugInfo.timing.total = Date.now() - debugInfo.timing.start;

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      message: 'Debug error',
      error: err.message
    }, { status: 500 });
  }
} 