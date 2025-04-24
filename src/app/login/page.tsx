'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import { API_ENDPOINTS, axiosConfig } from '@/lib/config';

// Component that uses searchParams
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams?.get('from') || '/admin'; // Default redirect to admin

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Sending login request:', { username, password: '***' });
      const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password }, axiosConfig);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        console.log('Login successful, redirecting to:', fromPath);
        
        // Wait a moment for the cookie to be set
        setTimeout(() => {
          // Force a hard navigation to bypass client-side routing 
          // which might be causing the login state issues
          window.location.href = fromPath;
        }, 500);
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Login error:', error.response?.data || err);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Enter your credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <div className="text-center text-sm mt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </div>
          <div className="text-center text-sm mt-2">
            <Link href="/reset-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

// Fallback component for suspense
function LoginFormFallback() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Loading login form...
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
} 