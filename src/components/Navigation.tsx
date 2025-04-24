import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const Navigation = async () => {
  let session = null;
  
  try {
    session = await getSession();
  } catch (error) {
    console.error("Error getting session:", error);
  }

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
          {session?.user?.isAdmin ? (
            <>
              <Link href="/admin" passHref>
                <Button variant="secondary">Admin Dashboard</Button>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <Button variant="ghost" type="submit">Log Out</Button>
              </form>
            </>
          ) : session?.user ? (
            <form action="/api/auth/logout" method="POST">
              <Button variant="ghost" type="submit">Log Out</Button>
            </form>
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