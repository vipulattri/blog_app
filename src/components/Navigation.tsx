'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS, axiosConfig } from '@/lib/config';

const Navigation = () => {
  const [user, setUser] = useState<{id: string, username: string, isAdmin: boolean} | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Using the debug endpoint to check session
        const response = await axios.get('/api/auth/debug', axiosConfig);
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(API_ENDPOINTS.LOGOUT, {}, axiosConfig);
      setUser(null);
      // Redirect to home page after logout
      router.push('/');
      
      // Force a refresh to update state across the app
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="border-b border-stone-200 bg-white py-4">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-stone-900">
            Vipul&apos;s Blog
          </Link>
          <Link href="/" className="text-stone-600 hover:text-stone-900">
            Home
          </Link>
          <Link href="/blogs" className="text-stone-600 hover:text-stone-900">
            All Blogs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : user?.isAdmin ? (
            <>
              <Link href="/admin" passHref>
                <Button variant="secondary">Admin Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
            </>
          ) : user ? (
            <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
          ) : (
            <Link href="/login" passHref>
              <Button variant="outline">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 