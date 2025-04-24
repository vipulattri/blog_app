import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function resetPassword() {
  console.log('Resetting password for local user...');
  
  // Check if the users file exists
  if (!fs.existsSync(USERS_FILE)) {
    console.error('Users file not found at', USERS_FILE);
    return;
  }
  
  try {
    // Read the users file
    const usersData = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    
    if (!Array.isArray(usersData) || usersData.length === 0) {
      console.error('No users found in the users file');
      return;
    }
    
    // Find the admin user (typically the first user)
    const adminUser = usersData.find(user => user.username === 'Vipul' || user.isAdmin);
    
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }
    
    // Hash the new password
    const newPassword = '123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    adminUser.password = hashedPassword;
    
    // Save the updated users data
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
    
    console.log(`Password reset successfully for user: ${adminUser.username}`);
    console.log(`New password: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  }
}

resetPassword(); 