'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { blogService, BlogPost } from '@/lib/blogService';

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = () => {
      try {
        const id = params.id as string;
        const fetchedBlog = blogService.getBlogById(id);
        
        if (fetchedBlog) {
          setBlog(fetchedBlog);
        } else {
          setError('Blog post not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog post');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

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
      <div className="container mx-auto py-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-xl text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>
        <div className="rounded-md bg-red-50 p-4 text-red-700 border border-red-200">
          {error || 'Blog post not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
      </div>

      <article className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{blog.title}</h1>
        <p className="mb-8 text-gray-500">
          {formatDate(blog.createdAt)}
        </p>

        <div className="relative mb-12 h-64 overflow-hidden rounded-lg bg-gradient-to-r from-blue-400 to-purple-500">
          {/* Placeholder for blog image */}
          <div className="absolute flex h-full w-full items-center justify-center text-white font-bold text-lg">
            Blog Image
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {blog.content && blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
          {!blog.content && (
            <p className="mb-4">No content available</p>
          )}
        </div>
      </article>
    </div>
  );
} 