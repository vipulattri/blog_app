// Script to create an admin user directly in MongoDB
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// MongoDB connection string - same as the one in your .env.local
const uri = 'mongodb+srv://attrivipul72:attrivipul72@cluster0.tmp1gvh.mongodb.net/blog_app?retryWrites=true&w=majority&appName=Cluster0';

// Admin user credentials
const adminUser = {
  username: 'Vipul',
  password: '123456',
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

async function createAdminUser() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('blog_app');
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username: adminUser.username });
    
    if (existingUser) {
      console.log('Admin user already exists:', existingUser);
      
      // Update the user's password if needed
      console.log('Updating admin password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      await usersCollection.updateOne(
        { username: adminUser.username },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );
      
      console.log('Admin password updated successfully');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminUser.password, salt);
      
      const result = await usersCollection.insertOne({
        ...adminUser,
        password: hashedPassword
      });
      
      console.log('Admin user created successfully:', result.insertedId);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

createAdminUser(); 