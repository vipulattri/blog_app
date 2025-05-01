// Configuration file for frontend-only application

// Local storage keys
export const STORAGE_KEYS = {
  BLOGS: 'blog_posts',
  USER: 'current_user',
  AUTH_TOKEN: 'auth_token'
};

// Default blog data
export const DEFAULT_BLOGS = [
  {
    _id: '1',
    title: 'Welcome to My Tech Blog',
    content: 'This is my first blog post. I\'ll be sharing my thoughts and experiences about technology and development here.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Local storage helper functions
export const storage = {
  get: (key: string) => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  },
  set: (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}; 