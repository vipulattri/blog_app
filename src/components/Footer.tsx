'use client';

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState('');
  
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);
  
  return (
    <footer className="border-t border-stone-200 bg-white py-6 text-center text-stone-500">
      <div className="container mx-auto px-4">
        <p>© {year} Vipul's Blog. All rights reserved.</p>
      </div>
    </footer>
  );
} 