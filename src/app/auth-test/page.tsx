'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

export default function AuthTestPage() {
  const [username, setUsername] = useState('Vipul');
  const [password, setPassword] = useState('123456');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetResult, setResetResult] = useState<any>(null);

  const testAuth = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      const response = await axios.post('/api/auth/test-auth', { username, password });
      setResult(response.data);
    } catch (err) {
      console.error('Test auth error:', err);
      setError('Auth test failed');
    } finally {
      setLoading(false);
    }
  };

  const resetAdmin = async () => {
    try {
      setLoading(true);
      setError('');
      setResetResult(null);
      
      const response = await axios.post('/api/auth/reset-admin', { username, password });
      setResetResult(response.data);
    } catch (err) {
      console.error('Reset error:', err);
      setError('Reset failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      const response = await axios.post('/api/auth/login', { username, password });
      setResult({
        success: response.data.success,
        message: response.data.message,
        loginResult: response.data
      });
      
      if (response.data.success) {
        window.location.href = '/admin';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Test your authentication credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Username</label>
            <Input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          <div className="space-y-2">
            <label>Password</label>
            <Input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={testAuth} disabled={loading}>
            Test Credentials
          </Button>
          <Button onClick={login} disabled={loading} variant="default">
            Try Login
          </Button>
          <Button onClick={resetAdmin} disabled={loading} variant="destructive">
            Reset Admin Password
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {resetResult && (
        <Card>
          <CardHeader>
            <CardTitle>Reset Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(resetResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 