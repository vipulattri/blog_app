'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const id = params.id as string;
        const response = await axios.get(`/api/blogs/${id}`);
        
        console.log('Blog response:', response.data);
        
        if (response.data.success && response.data.data) {
          // Extract the blog from the response.data.data
          setBlog(response.data.data);
        } else if (response.data._id) {
          // Direct blog object in response (for backwards compatibility)
          setBlog(response.data);
        } else {
          setError('Blog post not found or invalid format');
          console.error('Invalid blog format:', response.data);
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
        <p>Loading blog post...</p>
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
        <div className="rounded-md bg-red-50 p-4 text-red-700">
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

        <div className="relative mb-12 h-64 overflow-hidden rounded-lg bg-gray-200">
          {/* Placeholder for blog image */}
          <div className="absolute flex h-full w-full items-center justify-center text-gray-500">
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