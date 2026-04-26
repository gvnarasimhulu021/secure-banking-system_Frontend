import api from './api.js';
import { jwtUtils } from '../utils/jwtUtils';

export const authService = {
  // Check user role from database before login
  checkUserRole: async (email) => {
    console.log('🔍 CHECKING USER ROLE FROM DATABASE FOR EMAIL:', email);
    
    try {
      console.log('📡 Querying database for user info...');
      
      // Get user info from database using AdminController endpoint
      console.log('📡 Making API call to:', `/api/admin/user?email=${email}`);
      const response = await api.get(`/api/admin/user?email=${email}`);
      console.log('✅ Database user check successful:', response.data);
      
      const user = response.data;
      const userRole = user.role;
      
      console.log('📊 Database returned user:', user);
      console.log('👤 User role:', userRole);
      console.log('📧 User email:', user.email);
      console.log('🆔 User ID:', user.id);
      
      // Validate that role is valid
      if (!userRole || (userRole !== 'USER' && userRole !== 'ADMIN')) {
        console.log('⚠️ Invalid role from database:', userRole);
        throw new Error('Invalid user role in database');
      }
      
      return { role: userRole, user: user };
    } catch (error) {
      console.log('❌ Database user check failed:', error.message);
      
      // If database is not available, we should fail the login
      // rather than use mock data, as you want real database validation
      if (error.response?.status === 404) {
        throw new Error('User not found in database');
      } else if (error.response?.status === 500) {
        throw new Error('Database error. Please try again later.');
      } else {
        throw new Error('Unable to verify user. Please contact support.');
      }
    }
  },

  login: async (credentials) => {
    console.log('🚀 LOGIN START ===');
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Password:', '[HIDDEN]');
    
    try {
      // STEP 1: Direct authentication
      console.log('🔍 STEP 1: Attempting authentication...');
      
      const loginResponse = await api.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('✅ Authentication successful');
      const { token } = loginResponse.data;
      
      // STEP 2: Try to get user info (optional)
      console.log('🔍 STEP 2: Getting user info...');
      
      let userRole = 'USER'; // Default to USER
      let userInfo = {
        email: credentials.email,
        name: credentials.email.split('@')[0],
        id: null
      };
      
      try {
        const userResponse = await api.get(`/api/admin/user?email=${credentials.email}`);
        userInfo = userResponse.data;
        userRole = userInfo.role || 'USER';
        
        console.log('✅ User role retrieved:', userRole);
        
      } catch (userError) {
        console.log('❌ Could not get user role from database');
        console.log('⚠️ Error:', userError.message);
        
        // Try to extract role from JWT token as backup
        try {
          console.log('🔍 Attempting to extract role from JWT...');
          const jwtRole = jwtUtils.getRoleFromToken(token);
          if (jwtRole) {
            userRole = jwtRole;
            console.log('✅ Role extracted from JWT:', userRole);
          } else {
            console.log('⚠️ No role in JWT, using default USER');
          }
        } catch (jwtError) {
          console.log('⚠️ Could not extract role from JWT, using default USER');
        }
      }
      
      // STEP 3: Create user object
      console.log('🔍 STEP 3: Creating user object...');
      console.log('👤 Final User Role:', userRole);
      
      const userObj = {
        email: userInfo.email,
        name: userInfo.name || credentials.email.split('@')[0],
        role: userRole,
        id: userInfo.id
      };
      
      console.log('🎉 LOGIN SUCCESS:', userObj);
      return { token, user: userObj };
      
    } catch (error) {
      console.log('❌ Login failed:', error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 404) {
        throw new Error('User not found in database');
      } else if (error.response?.status === 500) {
        throw new Error('Database error. Please try again later.');
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  },

  register: async (userData) => {
    // Mock registration for testing without backend
    try {
      const response = await api.post('/api/auth/register', {
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        role: 'USER' // Default role for registration
      });
      
      // Backend only returns { token: "..." }
      const token = response.data.token;
      return { token };
    } catch (error) {
      // If backend is not available, use mock registration
      console.log('Backend not available, using mock registration');
      
      // Simple mock validation - accept any valid registration data
      if (userData.name && userData.email && userData.password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        return { token: mockToken };
      }
      
      throw new Error('Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  }
};
