import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import connectDB, { getFileBlogs, isUsingMongo } from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { formatDate } from '@/lib/utils';

interface BlogWithId extends IBlog {
  _id: string;
}

async function getBlogs() {
  try {
    await connectDB();
    
    // Check if we're using MongoDB or file-based storage
    if (isUsingMongo()) {
      console.log('Admin: Using MongoDB for blogs');
      const blogs = await Blog.find({}).sort({ createdAt: -1 });
      return JSON.parse(JSON.stringify(blogs)) as BlogWithId[];
    } else {
      console.log('Admin: Using file-based storage for blogs');
      // Use file-based blog storage
      const blogs = getFileBlogs();
      // Ensure each blog has required fields and sort by createdAt
      return blogs
        .map((blog: any) => ({
          ...blog,
          _id: blog._id || String(Math.random()),
          createdAt: blog.createdAt || new Date().toISOString(),
          updatedAt: blog.updatedAt || new Date().toISOString()
        }))
        .sort((a: any, b: any) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }) as BlogWithId[];
    }
  } catch (error) {
    console.error('Error getting blogs for admin:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  console.log('Rendering admin dashboard...');
  
  // Get the user's session
  const session = await getSession();
  
  console.log('Admin session check:', {
    hasSession: !!session,
    user: session?.user ? {
      id: session.user.id,
      username: session.user.username,
      isAdmin: session.user.isAdmin
    } : null
  });
  
  // Handle unauthorized access
  if (!session?.user?.isAdmin) {
    console.log('No admin session found, redirecting to login');
    redirect('/login');
  }
  
  // Get blogs to display in the admin dashboard
  const blogs = await getBlogs();
  console.log('Admin blogs loaded:', blogs.length);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-600">Manage your blog posts</p>
        </div>
        <Link href="/admin/new-blog" passHref>
          <Button>Create New Blog</Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-stone-500">Actions</th>
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
                    <td className="max-w-[400px] px-6 py-4 text-sm">
                      <div className="line-clamp-1 font-medium text-stone-900">{blog.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Link href={`/blog/${blog._id}`} passHref>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <Link href={`/admin/edit-blog/${blog._id}`} passHref>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <Link href={`/admin/delete-blog/${blog._id}`} passHref>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </Link>
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