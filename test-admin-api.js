const axios = require('axios');

async function testAdminAPI() {
  try {
    console.log('Testing admin recent users endpoint...');
    const response = await axios.get('https://farmrent-backend.onrender.com/api/admin/recent-users');
    console.log('Success:', response.data);
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
  
  try {
    console.log('\nTesting admin analytics endpoint...');
    const response = await axios.get('https://farmrent-backend.onrender.com/api/admin/analytics');
    console.log('Success:', response.data);
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

testAdminAPI();