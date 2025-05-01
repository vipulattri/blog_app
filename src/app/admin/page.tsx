'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Eye, Loader2 } from 'lucide-react';
import { blogService, BlogPost } from '@/lib/blogService';
import { authService } from '@/lib/authService';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const checkAdminAndFetchBlogs = () => {
      try {
        setLoading(true);
        const authState = authService.init();
        
        if (!authState.isAuthenticated || !authService.isAdmin()) {
          console.log('Not authenticated or not admin, redirecting to login');
          router.push('/login?from=/admin');
          return;
        }
        
        console.log('User is authenticated and admin, fetching blogs');
        const fetchedBlogs = blogService.getAllBlogs();
        setBlogs(fetchedBlogs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
        setLoading(false);
      }
    };

    checkAdminAndFetchBlogs();
  }, [router]);

  const handleDeleteBlog = (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleteLoading(id);
      const success = blogService.deleteBlog(id);
      
      if (success) {
        // Remove the blog from state
        setBlogs(blogs.filter(blog => blog._id !== id));
      } else {
        alert('Failed to delete blog');
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
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-stone-900">{blog.title}</h2>
                <p className="text-stone-600 mt-1">Created: {formatDate(blog.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/blog/${blog._id}`} passHref>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Link href={`/admin/edit-blog/${blog._id}`} passHref>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteBlog(blog._id)}
                  disabled={deleteLoading === blog._id}
                >
                  {deleteLoading === blog._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 