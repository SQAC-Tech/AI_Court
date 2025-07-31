const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  baseURL: API_BASE_URL,
  timeout: 5000
};

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'TestPass123',
  displayName: 'Test User',
  role: 'user',
  phone: '+1234567890',
  address: '123 Test St, Test City'
};

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:5000/');
    console.log('✅ Health check passed:', healthResponse.data.message);
    console.log('   Firebase status:', healthResponse.data.firebase);
    console.log('');

    // Test 2: Test signup endpoint
    console.log('2. Testing signup endpoint...');
    try {
      const signupResponse = await axios.post(`${API_BASE_URL}/auth/signup`, testUser);
      console.log('✅ Signup endpoint working');
      console.log('   User created:', signupResponse.data.user.email);
      console.log('');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('✅ Signup endpoint working (user already exists)');
        console.log('');
      } else {
        console.log('❌ Signup endpoint failed:', error.response?.data?.message || error.message);
        console.log('');
      }
    }

    // Test 3: Test login endpoint
    console.log('3. Testing login endpoint...');
    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login endpoint working');
      console.log('   Token received:', !!loginResponse.data.token);
      console.log('   User role:', loginResponse.data.user.role);
      console.log('');
      
      const token = loginResponse.data.token;
      
      // Test 4: Test profile endpoint with token
      console.log('4. Testing profile endpoint...');
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Profile endpoint working');
        console.log('   User email:', profileResponse.data.user.email);
        console.log('');
      } catch (error) {
        console.log('❌ Profile endpoint failed:', error.response?.data?.message || error.message);
        console.log('');
      }

      // Test 5: Test verify endpoint
      console.log('5. Testing verify endpoint...');
      try {
        const verifyResponse = await axios.post(`${API_BASE_URL}/auth/verify`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Verify endpoint working');
        console.log('   User verified:', verifyResponse.data.user.email);
        console.log('');
      } catch (error) {
        console.log('❌ Verify endpoint failed:', error.response?.data?.message || error.message);
        console.log('');
      }

      // Test 6: Test logout endpoint
      console.log('6. Testing logout endpoint...');
      try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Logout endpoint working');
        console.log('');
      } catch (error) {
        console.log('❌ Logout endpoint failed:', error.response?.data?.message || error.message);
        console.log('');
      }

    } catch (error) {
      console.log('❌ Login endpoint failed:', error.response?.data?.message || error.message);
      console.log('');
    }

    // Test 7: Test Firebase auth endpoints
    console.log('7. Testing Firebase auth endpoints...');
    const firebaseTestData = {
      email: 'firebase-test@example.com',
      firebaseUid: 'test-firebase-uid-123',
      provider: 'google'
    };

    try {
      const firebaseLoginResponse = await axios.post(`${API_BASE_URL}/auth/firebase-login`, firebaseTestData);
      console.log('✅ Firebase login endpoint working');
      console.log('   User created/retrieved:', firebaseLoginResponse.data.user.email);
      console.log('');
    } catch (error) {
      if (error.response?.status === 404) {
        // User doesn't exist, try signup
        try {
          const firebaseSignupResponse = await axios.post(`${API_BASE_URL}/auth/firebase-signup`, firebaseTestData);
          console.log('✅ Firebase signup endpoint working');
          console.log('   User created:', firebaseSignupResponse.data.user.email);
          console.log('');
        } catch (signupError) {
          console.log('❌ Firebase signup endpoint failed:', signupError.response?.data?.message || signupError.message);
          console.log('');
        }
      } else {
        console.log('❌ Firebase login endpoint failed:', error.response?.data?.message || error.message);
        console.log('');
      }
    }

    console.log('🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the backend server is running on port 5000');
    }
  }
}

// Run the tests
testAPIEndpoints(); 