// Test script for login functionality
import fetch from 'node-fetch';

// Test credentials
const credentials = {
  username: 'Vipul',
  password: '123456'
};

async function testLogin() {
  console.log('Testing login with credentials:', { username: credentials.username, password: '******' });
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (data.success) {
      console.log('Login successful! User:', data.user);
    } else {
      console.log('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testLogin(); 