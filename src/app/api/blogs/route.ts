import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB, { getFileBlogs, saveFileBlogs, isUsingMongo } from '@/lib/db';
import Blog from '@/models/Blog';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs'; // Force Node.js runtime instead of Edge

// Get all blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    let blogs = [];
    
    if (isUsingMongo()) {
      console.log('API: Using MongoDB for fetching blogs');
      const fetchedBlogs = await Blog.find({}).sort({ createdAt: -1 });
      blogs = fetchedBlogs.map(blog => blog.toObject());
    } else {
      console.log('API: Using file-based storage for fetching blogs');
      blogs = getFileBlogs();
      blogs = blogs.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
    
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// Create a new blog
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    let blog;
    
    // Check if we're using MongoDB or file-based storage
    if (isUsingMongo()) {
      blog = await Blog.create({ title, content });
    } else {
      // Use file-based blog storage
      const blogs = getFileBlogs();
      blog = {
        _id: new mongoose.Types.ObjectId().toString(),
        title,
        content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      blogs.push(blog);
      saveFileBlogs(blogs);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error: any) {
    console.error("Error creating blog:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create blog' 
      },
      { status: 500 }
    );
  }
} 