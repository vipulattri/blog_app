import { STORAGE_KEYS, storage } from './config';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const authService = {
  // Initialize auth state
  init: (): AuthState => {
    const user = storage.get(STORAGE_KEYS.USER);
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    return {
      user,
      token,
      isAuthenticated: !!(user && token)
    };
  },

  // Login
  login: (email: string, password: string): AuthState | null => {
    console.log('AuthService login called with:', { email, password });
    // In a real app, you would validate credentials
    // For demo purposes, we'll use a simple check
    if (email === 'admin@example.com' && password === 'admin123') {
      console.log('Admin credentials matched');
      const user: User = {
        _id: '1',
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin'
      };
      const token = 'demo-token-' + Date.now();
      
      console.log('Setting user and token in storage');
      storage.set(STORAGE_KEYS.USER, user);
      storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
      
      const result = {
        user,
        token,
        isAuthenticated: true
      };
      console.log('Login result:', result);
      return result;
    }
    console.log('Invalid credentials');
    return null;
  },

  // Register
  register: (username: string, email: string, password: string): AuthState | null => {
    // In a real app, you would validate and create a new user
    // For demo purposes, we'll create a simple user
    const user: User = {
      _id: Date.now().toString(),
      username,
      email,
      role: 'user'
    };
    const token = 'demo-token-' + Date.now();
    
    storage.set(STORAGE_KEYS.USER, user);
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
    
    return {
      user,
      token,
      isAuthenticated: true
    };
  },

  // Logout
  logout: (): void => {
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return storage.get(STORAGE_KEYS.USER);
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = storage.get(STORAGE_KEYS.USER);
    return user?.role === 'admin';
  }
}; 