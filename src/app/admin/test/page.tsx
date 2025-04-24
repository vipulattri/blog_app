'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import Link from 'next/link';

interface AuthStatus {
  authenticated: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
  tokenInfo?: {
    id: string;
    username: string;
    isAdmin: boolean;
    exp?: number;
  };
  error?: string;
}

export default function AdminTestPage() {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/debug');
        setAuthStatus(response.data);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Failed to check auth status');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Admin Test Page</h1>
      
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="outline">Back to Admin Dashboard</Button>
        </Link>
      </div>
      
      <div className="rounded-lg border bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Authentication Status</h2>
        
        {loading ? (
          <p>Loading authentication status...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="font-medium">Authentication:</p>
              <p className={authStatus?.authenticated ? "text-green-600" : "text-red-600"}>
                {authStatus?.authenticated ? "Authenticated" : "Not Authenticated"}
              </p>
            </div>
            
            {authStatus?.user && (
              <div>
                <p className="font-medium">User:</p>
                <pre className="mt-2 rounded bg-gray-100 p-2">
                  {JSON.stringify(authStatus.user, null, 2)}
                </pre>
              </div>
            )}
            
            {authStatus?.tokenInfo && (
              <div>
                <p className="font-medium">Token Info:</p>
                <pre className="mt-2 rounded bg-gray-100 p-2">
                  {JSON.stringify(authStatus.tokenInfo, null, 2)}
                </pre>
              </div>
            )}
            
            {authStatus?.message && (
              <div>
                <p className="font-medium">Message:</p>
                <p className="text-gray-700">{authStatus.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 