import { STORAGE_KEYS, storage } from './config';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const blogService = {
  // Get all blogs
  getAllBlogs: (): BlogPost[] => {
    return storage.get(STORAGE_KEYS.BLOGS) || [];
  },

  // Get a single blog by ID
  getBlogById: (id: string): BlogPost | null => {
    const blogs: BlogPost[] = storage.get(STORAGE_KEYS.BLOGS) || [];
    return blogs.find((blog: BlogPost) => blog._id === id) || null;
  },

  // Create a new blog
  createBlog: (blog: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>): BlogPost => {
    const blogs: BlogPost[] = storage.get(STORAGE_KEYS.BLOGS) || [];
    const newBlog: BlogPost = {
      ...blog,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    blogs.push(newBlog);
    storage.set(STORAGE_KEYS.BLOGS, blogs);
    return newBlog;
  },

  // Update an existing blog
  updateBlog: (id: string, blog: Partial<BlogPost>): BlogPost | null => {
    const blogs: BlogPost[] = storage.get(STORAGE_KEYS.BLOGS) || [];
    const index = blogs.findIndex((b: BlogPost) => b._id === id);
    if (index === -1) return null;

    const updatedBlog = {
      ...blogs[index],
      ...blog,
      updatedAt: new Date().toISOString()
    };
    blogs[index] = updatedBlog;
    storage.set(STORAGE_KEYS.BLOGS, blogs);
    return updatedBlog;
  },

  // Delete a blog
  deleteBlog: (id: string): boolean => {
    const blogs: BlogPost[] = storage.get(STORAGE_KEYS.BLOGS) || [];
    const filteredBlogs = blogs.filter((blog: BlogPost) => blog._id !== id);
    if (filteredBlogs.length === blogs.length) return false;
    
    storage.set(STORAGE_KEYS.BLOGS, filteredBlogs);
    return true;
  }
}; 