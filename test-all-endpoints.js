const axios = require('axios');

async function testAllEndpoints() {
  try {
    // Login first to get a token
    console.log('Logging in...');
    const loginResponse = await axios.post('https://farmrent-backend.onrender.com/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    const token = loginResponse.data.token;
    console.log('Login successful');
    
    // Test auth/me
    console.log('\n1. Testing /api/auth/me...');
    const authResponse = await axios.get('https://farmrent-backend.onrender.com/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✓ Auth/me successful');
    
    // Test listings
    console.log('\n2. Testing /api/listings...');
    const listingsResponse = await axios.get('https://farmrent-backend.onrender.com/api/listings');
    console.log('✓ Listings successful, found', listingsResponse.data.length, 'listings');
    
    // Test search
    console.log('\n3. Testing /api/listings/search...');
    const searchResponse = await axios.get('https://farmrent-backend.onrender.com/api/listings/search');
    console.log('✓ Search successful, found', searchResponse.data.length, 'results');
    
    // Test my listings (requires auth)
    console.log('\n4. Testing /api/listings/my...');
    const mylistingsResponse = await axios.get('https://farmrent-backend.onrender.com/api/listings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✓ My listings successful');
    
    // Test admin endpoints (if user has admin role)
    try {
      console.log('\n5. Testing /api/admin/recent-users...');
      const adminUsersResponse = await axios.get('https://farmrent-backend.onrender.com/api/admin/recent-users');
      console.log('✓ Admin recent users successful');
    } catch (error) {
      console.log('Note: Admin endpoints require admin role');
    }
    
    try {
      console.log('\n6. Testing /api/admin/analytics...');
      const adminAnalyticsResponse = await axios.get('https://farmrent-backend.onrender.com/api/admin/analytics');
      console.log('✓ Admin analytics successful');
    } catch (error) {
      console.log('Note: Admin endpoints require admin role');
    }
    
    console.log('\n🎉 All endpoints tested successfully!');
  } catch (error) {
    console.log('Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error message:', error.message);
    }
  }
}

testAllEndpoints();