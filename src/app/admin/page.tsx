'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash2, Edit, Eye, Loader2 } from 'lucide-react';
import { API_ENDPOINTS, axiosConfig } from '@/lib/config';

interface Blog {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const checkAdminAndFetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.BLOGS, axiosConfig);
        setBlogs(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
        setLoading(false);
      }
    };

    checkAdminAndFetchBlogs();
  }, []);

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(id);
      const response = await axios.delete(API_ENDPOINTS.BLOG(id), axiosConfig);
      
      if (response.data.success) {
        // Remove the blog from state
        setBlogs(blogs.filter(blog => blog._id !== id));
      } else {
        alert('Failed to delete blog: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('An error occurred while deleting the blog.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-600">Manage your blog posts</p>
        </div>
        <Link href="/admin/new-blog" passHref>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            Create New Blog
          </Button>
        </Link>
      </div>

      {error && (
        <div className="my-6 rounded-md bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-stone-600">Title</th>
                <th className="px-4 sm:px-6 py-4 text-left text-sm font-medium text-stone-600 hidden sm:table-cell">Date</th>
                <th className="px-4 sm:px-6 py-4 text-right text-sm font-medium text-stone-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-stone-500">
                    No blogs found. Create your first blog post!
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-stone-50">
                    <td className="max-w-[200px] sm:max-w-[400px] px-4 sm:px-6 py-4 text-sm">
                      <div className="line-clamp-1 font-medium text-stone-900">{blog.title}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-stone-600 hidden sm:table-cell">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right text-sm">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Link href={`/blog/${blog._id}`} passHref>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Eye size={16} />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </Link>
                        <Link href={`/admin/edit-blog/${blog._id}`} passHref>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Edit size={16} />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteBlog(blog._id)}
                          disabled={deleteLoading === blog._id}
                          className="flex items-center gap-1"
                        >
                          {deleteLoading === blog._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                          <span className="hidden sm:inline">
                            {deleteLoading === blog._id ? 'Deleting...' : 'Delete'}
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 