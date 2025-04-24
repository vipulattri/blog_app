'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS, axiosConfig } from '@/lib/config';

export default function NewBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(API_ENDPOINTS.BLOGS, { title, content }, axiosConfig);
      if (response.data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(response.data.message || 'Failed to create blog post. Please try again.');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{message?: string}>;
      setError(axiosError.response?.data?.message || 'Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Create New Blog Post</h1>
        <Link href="/admin" passHref>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>

      <Card className="shadow-lg">
        <form onSubmit={handleSubmit}>
          <CardHeader className="sm:pb-4">
            <CardTitle className="text-xl sm:text-2xl">New Blog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-4 sm:px-6">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium block">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter blog title"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium block">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your blog content here..."
                className="min-h-[200px] sm:min-h-[300px] w-full resize-y"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 px-4 sm:px-6 pt-2 pb-4 sm:pb-6">
            <Link href="/admin" passHref className="w-full sm:w-auto">
              <Button variant="outline" type="button" className="w-full sm:w-auto">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {loading ? 'Creating...' : 'Create Blog Post'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 