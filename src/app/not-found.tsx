import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-4 text-5xl font-bold text-stone-900">404</h1>
      <h2 className="mb-6 text-2xl font-semibold text-stone-700">Page Not Found</h2>
      <p className="mb-8 max-w-md text-center text-stone-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" passHref>
        <Button>Return to Homepage</Button>
      </Link>
    </div>
  );
} 