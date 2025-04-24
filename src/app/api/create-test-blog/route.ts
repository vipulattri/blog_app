import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create a test blog post
    const testBlog = new Blog({
      _id: new mongoose.Types.ObjectId(),
      title: 'Test Blog Post',
      content: 'This is a test blog post created through the API to verify that MongoDB is working correctly. If you can see this post, it means your database connection is functional!',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await testBlog.save();
    
    return NextResponse.json({
      success: true,
      message: 'Test blog post created successfully',
      blog: {
        id: testBlog._id.toString(),
        title: testBlog.title,
        content: testBlog.content,
        createdAt: testBlog.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error creating test blog:', error);
    const err = error as Error;
    return NextResponse.json({
      success: false,
      message: 'Error creating test blog',
      error: err.message
    }, { status: 500 });
  }
} 