export default function TestPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-2xl font-bold">Test Page</h1>
      <p className="mt-4">This is a test page to verify routing is working.</p>
      <div className="mt-6">
        <a href="/login" className="text-blue-500 hover:underline">Go to Login Page</a>
      </div>
      <div className="mt-2">
        <a href="/register" className="text-blue-500 hover:underline">Go to Register Page</a>
      </div>
    </div>
  );
} 