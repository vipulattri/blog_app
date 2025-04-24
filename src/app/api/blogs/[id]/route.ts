import { NextRequest, NextResponse } from 'next/server';
import connectDB, { getFileBlogs, saveFileBlogs, isUsingMongo } from '@/lib/db';
import Blog from '@/models/Blog';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs'; // Force Node.js runtime instead of Edge

// Type for blog object from file storage
interface FileBlog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

// Get a single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    await connectDB();
    
    let blog;
    
    // Check if we're using MongoDB or file-based storage
    if (isUsingMongo()) {
      blog = await Blog.findById(id);
    } else {
      // Use file-based blog storage
      const blogs = getFileBlogs();
      blog = blogs.find((blog: FileBlog) => blog._id === id);
    }
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: blog 
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error fetching blog:", err.message);
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || 'Failed to fetch blog' 
      },
      { status: 500 }
    );
  }
}

// Update a blog by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { id } = params;
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
      blog = await Blog.findByIdAndUpdate(
        id,
        { title, content },
        { new: true, runValidators: true }
      );
    } else {
      // Use file-based blog storage
      const blogs = getFileBlogs();
      const blogIndex = blogs.findIndex((blog: FileBlog) => blog._id === id);
      
      if (blogIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Blog not found' },
          { status: 404 }
        );
      }
      
      blogs[blogIndex] = {
        ...blogs[blogIndex],
        title,
        content,
        updatedAt: new Date().toISOString()
      };
      
      saveFileBlogs(blogs);
      blog = blogs[blogIndex];
    }
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error updating blog:", err.message);
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || 'Failed to update blog' 
      },
      { status: 500 }
    );
  }
}

// Delete a blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAdmin(request);
    
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    
    const { id } = params;
    
    await connectDB();
    
    let blog;
    
    // Check if we're using MongoDB or file-based storage
    if (isUsingMongo()) {
      blog = await Blog.findByIdAndDelete(id);
    } else {
      // Use file-based blog storage
      const blogs = getFileBlogs();
      const blogIndex = blogs.findIndex((blog: FileBlog) => blog._id === id);
      
      if (blogIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'Blog not found' },
          { status: 404 }
        );
      }
      
      blog = blogs[blogIndex];
      blogs.splice(blogIndex, 1);
      saveFileBlogs(blogs);
    }
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error deleting blog:", err.message);
    return NextResponse.json(
      { 
        success: false, 
        message: err.message || 'Failed to delete blog' 
      },
      { status: 500 }
    );
  }
} 