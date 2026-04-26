import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const savedToken = authService.getToken();
      const savedUser = authService.getUser();
      
      console.log('Initializing auth:', { savedToken, savedUser });
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        setRole(savedUser.role);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('=== AUTH CONTEXT LOGIN START ===');
      console.log('Credentials received:', credentials);
      const response = await authService.login(credentials);
      console.log('AuthService response:', response);
      
      const { token, user: backendUser } = response;
      console.log('Token:', token);
      console.log('Backend user:', backendUser);
      
      // Store token
      localStorage.setItem('token', token);
      setToken(token);
      
      // Use user data from backend if available, otherwise create from credentials
      const userData = backendUser || {
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'User',
        role: credentials.role || 'USER'
      };
      
      console.log('Final user data:', userData);
      console.log('User role:', userData.role);
      
      // Save user data to localStorage and state
      authService.saveUser(userData);
      setUser(userData);
      setRole(userData.role);
      
      console.log('Authentication complete with role:', userData.role);
      console.log('=== AUTH CONTEXT LOGIN END ===');
      return { ...response, role: userData.role, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setRole(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    token,
    role,
    login,
    logout,
    loading,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
