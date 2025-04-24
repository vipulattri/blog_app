'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

export default function SetupPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const runMongoSetup = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get('/api/auth/setup-mongodb');
      setResult(response.data);
      
      if (response.data.success) {
        setStep(2);
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('MongoDB setup failed. Check if your MONGODB_URI environment variable is set correctly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Vercel Deployment Setup</CardTitle>
          <CardDescription>Follow these steps to set up your app on Vercel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`${step === 1 ? 'border-blue-500' : 'border-green-500'} border p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold flex items-center">
              <div className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full ${step === 1 ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
                1
              </div>
              Environment Setup
            </h3>
            <p className="mt-2 text-gray-600">
              Make sure you have the following environment variables set in your Vercel project:
            </p>
            <ul className="mt-2 ml-8 list-disc space-y-1 text-gray-600">
              <li><strong>MONGODB_URI</strong> - Your MongoDB connection string</li>
              <li><strong>JWT_SECRET</strong> - A secure random string for JWT tokens</li>
            </ul>
          </div>

          <div className={`${step === 2 ? 'border-blue-500' : step > 2 ? 'border-green-500' : 'border-gray-200'} border p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold flex items-center">
              <div className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full ${step === 2 ? 'bg-blue-500' : step > 2 ? 'bg-green-500' : 'bg-gray-300'} text-white`}>
                2
              </div>
              MongoDB Initialization
            </h3>
            <p className="mt-2 text-gray-600">
              Initialize MongoDB with a default admin user:
            </p>
            <div className="mt-4">
              <Button 
                onClick={runMongoSetup} 
                disabled={loading || step > 2}
                className="mt-2"
              >
                {loading ? 'Setting up...' : 'Initialize MongoDB'}
              </Button>
            </div>
          </div>

          <div className={`${step === 3 ? 'border-blue-500' : step > 3 ? 'border-green-500' : 'border-gray-200'} border p-4 rounded-lg`}>
            <h3 className="text-lg font-semibold flex items-center">
              <div className={`mr-2 flex h-6 w-6 items-center justify-center rounded-full ${step === 3 ? 'bg-blue-500' : step > 3 ? 'bg-green-500' : 'bg-gray-300'} text-white`}>
                3
              </div>
              Test Login
            </h3>
            <p className="mt-2 text-gray-600">
              Try logging in with the following credentials:
            </p>
            <ul className="mt-2 ml-8 list-disc space-y-1 text-gray-600">
              <li><strong>Username:</strong> Vipul</li>
              <li><strong>Password:</strong> 123456</li>
            </ul>
            <div className="mt-4">
              <Button 
                onClick={() => window.location.href = '/login'} 
                variant="default"
                className="mt-2"
              >
                Go to Login Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 