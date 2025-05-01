'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authService } from '@/lib/authService';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authState = authService.init();
        if (authState.isAuthenticated) {
          setUser(authState.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    try {
      authService.logout();
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Blog App
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {authService.isAdmin() && (
                  <Link href="/admin">
                    <Button variant="outline">Admin Dashboard</Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="ghost">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 