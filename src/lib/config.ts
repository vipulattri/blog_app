// Configuration file to manage environment-specific settings

// Determine base API URL based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

// Use localhost in development, actual domain in production
export const API_BASE_URL = isDevelopment 
  ? '' // Empty string means relative URLs will use current domain (localhost)
  : 'https://blog-app-ochre-delta-23.vercel.app';

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  BLOGS: `${API_BASE_URL}/api/blogs`,
  BLOG: (id: string) => `${API_BASE_URL}/api/blogs/${id}`,
};

// Configuration for axios
export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
}; 