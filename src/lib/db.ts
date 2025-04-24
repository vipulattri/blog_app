import mongoose, { Mongoose } from 'mongoose';

// Database connection constants
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_app';

// Skip connection logs during build time
const isBuildTime = process.env.VERCEL_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';
const isVercelProduction = !!process.env.VERCEL_ENV;

if (!isBuildTime) {
  console.log('MongoDB connection string:', MONGODB_URI);
}

// Global interface for mongoose cache
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Add mongoose to global scope
declare global {
  var mongoose: MongooseCache | undefined;
}

// Cached connection
let cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });
let isMongoConnected = false;

// File storage variables (only initialized on server and not in Vercel)
let fsModule: any = null;
let pathModule: any = null;
let DATA_DIR: string = '';
let BLOGS_FILE: string = '';
let USERS_FILE: string = '';

// Initialize file storage on server only (not during build and not in Vercel production)
if (typeof window === 'undefined' && !isBuildTime && !isVercelProduction) {
  // Import modules dynamically to avoid "Module not found" errors in the browser
  const initFileStorage = async () => {
    try {
      fsModule = await import('fs').then(m => m.default || m);
      pathModule = await import('path').then(m => m.default || m);
      
      DATA_DIR = pathModule.join(process.cwd(), 'data');
      
      // Create data directory if needed
      if (!fsModule.existsSync(DATA_DIR)) {
        fsModule.mkdirSync(DATA_DIR, { recursive: true });
      }
      
      BLOGS_FILE = pathModule.join(DATA_DIR, 'blogs.json');
      USERS_FILE = pathModule.join(DATA_DIR, 'users.json');
      
      // Initialize files if needed
      if (!fsModule.existsSync(BLOGS_FILE)) {
        fsModule.writeFileSync(BLOGS_FILE, JSON.stringify([]));
      }
      
      if (!fsModule.existsSync(USERS_FILE)) {
        const defaultUser = {
          _id: new mongoose.Types.ObjectId().toString(),
          username: 'Vipul',
          password: '$2a$10$qnrH1ZrESzrC4.pNiKeqiuNEqmFpPMSVFj6REaLl8jv7CdyBYJ6r.', // hashed '123456'
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        fsModule.writeFileSync(USERS_FILE, JSON.stringify([defaultUser]));
      }
      
      console.log('File storage initialized successfully');
    } catch (error) {
      console.error('Error initializing file storage:', error);
    }
  };
  
  // Call the async initialization function
  initFileStorage();
}

/**
 * Connect to MongoDB database
 */
async function connectDB(): Promise<Mongoose | null> {
  // Skip MongoDB connection during build time
  if (process.env.SKIP_DB_CONNECTION_IN_BUILD === 'true') {
    console.log('Skipping MongoDB connection during build time (environment variable set)');
    isMongoConnected = false;
    return null;
  }

  try {
    // Return cached connection if available
    if (cached.conn) {
      isMongoConnected = true;
      return cached.conn;
    }

    // Create new connection if no promise is in progress
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts) as any;
    }

    try {
      // Wait for connection
      const mongoose = await cached.promise;
      cached.conn = mongoose;
      isMongoConnected = true;
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      cached.promise = null;
      isMongoConnected = false;
      return null;
    }
  } catch (error) {
    console.error('❌ DB connection error:', error);
    isMongoConnected = false;
    return null;
  }
}

/**
 * Check if MongoDB is connected or if we're running in Vercel (always use MongoDB there)
 */
export function isUsingMongo(): boolean {
  return isMongoConnected || isVercelProduction;
}

/**
 * Get blogs from file storage
 */
export function getFileBlogs(): any[] {
  // In Vercel production, always return empty array to force MongoDB usage
  if (isVercelProduction) {
    console.log('File operations not available in Vercel environment - returning empty array');
    return [];
  }

  if (typeof window !== 'undefined' || !fsModule) {
    console.warn('File operations not available on client side');
    return [];
  }
  
  try {
    const data = fsModule.readFileSync(BLOGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading blogs file:', error);
    return [];
  }
}

/**
 * Save blogs to file storage
 */
export function saveFileBlogs(blogs: any[]): boolean {
  // In Vercel production, return false to indicate file operations aren't supported
  if (isVercelProduction) {
    console.log('File operations not available in Vercel environment - save operation skipped');
    return false;
  }

  if (typeof window !== 'undefined' || !fsModule) {
    console.warn('File operations not available on client side');
    return false;
  }
  
  try {
    fsModule.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing blogs file:', error);
    return false;
  }
}

/**
 * Get users from file storage
 */
export function getFileUsers(): any[] {
  // In Vercel production, return empty array to force MongoDB usage
  if (isVercelProduction) {
    console.log('File operations not available in Vercel environment - returning empty array');
    return [];
  }

  if (typeof window !== 'undefined' || !fsModule) {
    console.warn('File operations not available on client side');
    return [];
  }
  
  try {
    const data = fsModule.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

/**
 * Save users to file storage
 */
export function saveFileUsers(users: any[]): boolean {
  // In Vercel production, return false to indicate file operations aren't supported
  if (isVercelProduction) {
    console.log('File operations not available in Vercel environment - save operation skipped');
    return false;
  }

  if (typeof window !== 'undefined' || !fsModule) {
    console.warn('File operations not available on client side');
    return false;
  }
  
  try {
    fsModule.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
}

export default connectDB;
