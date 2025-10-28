const axios = require('axios');

async function testAuth() {
  try {
    // First, let's login as admin to get a token
    console.log('Logging in as admin...');
    const loginResponse = await axios.post('https://farmrent-backend.onrender.com/api/auth/login', {
      email: 'admin@farmrent.com',
      password: 'admin@farmrent.com' //new pass
    });
    console.log('Login successful');
    const token = loginResponse.data.token;
    console.log('Token:', token);
    
    // Now test the auth/me endpoint
    console.log('\nTesting auth/me endpoint...');
    const authResponse = await axios.get('https://farmrent-backend.onrender.com/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Auth successful, user data:', authResponse.data);
  } catch (error) {
    console.log('Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error message:', error.message);
    }
  }
}

testAuth();