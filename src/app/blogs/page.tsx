import connectDB, { getFileBlogs, isUsingMongo } from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import BlogCard from '@/components/BlogCard';

export const revalidate = 60; // Revalidate every 60 seconds

async function getBlogs() {
  try {
    await connectDB();
    
    // Check if we're using MongoDB or file-based storage
    if (isUsingMongo()) {
      console.log('Using MongoDB for blogs');
      const blogs = await Blog.find({}).sort({ createdAt: -1 });
      return JSON.parse(JSON.stringify(blogs));
    } else {
      console.log('Using file-based storage for blogs');
      // Use file-based blog storage
      const blogs = getFileBlogs();
      return blogs.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }
  } catch (error) {
    console.error('Error getting blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold text-stone-900 md:text-4xl">All Blogs</h1>
      <p className="mb-12 text-lg text-stone-600">Explore all posts on Vipul&apos;s Blog</p>

      {blogs.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-12 text-center shadow">
          <h2 className="mb-2 text-xl font-semibold">No blogs found</h2>
          <p className="text-stone-600">Check back later for new content!</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: IBlog) => (
            <BlogCard key={blog._id?.toString()} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
} 