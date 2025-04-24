'use client';

import { useEffect } from 'react';

export default function AdminClientPage() {
  useEffect(() => {
    // Simple hard redirect to root page
    window.location.href = '/';
  }, []);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-16">
      <p>Redirecting to home page...</p>
    </div>
  );
} 