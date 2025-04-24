import { NextRequest, NextResponse } from 'next/server';
import connectDB, { getFileBlogs, saveFileBlogs, isUsingMongo } from '@/lib/db';
import Blog from '@/models/Blog';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs'; // Force Node.js runtime instead of Edge

interface Params {
  params: {
    id: string;
  };
}

// Get a single blog by ID
export async function GET(request: NextRequest, { params }: Params) {
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
      blog = blogs.find((blog: any) => blog._id === id);
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
  } catch (error: any) {
    console.error("Error fetching blog:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch blog' 
      },
      { status: 500 }
    );
  }
}

// Update a blog by ID
export async function PUT(request: NextRequest, { params }: Params) {
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
      const blogIndex = blogs.findIndex((blog: any) => blog._id === id);
      
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
        updatedAt: new Date()
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
  } catch (error: any) {
    console.error("Error updating blog:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to update blog' 
      },
      { status: 500 }
    );
  }
}

// Delete a blog by ID
export async function DELETE(request: NextRequest, { params }: Params) {
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
      const blogIndex = blogs.findIndex((blog: any) => blog._id === id);
      
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
  } catch (error: any) {
    console.error("Error deleting blog:", error.message);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to delete blog' 
      },
      { status: 500 }
    );
  }
} 