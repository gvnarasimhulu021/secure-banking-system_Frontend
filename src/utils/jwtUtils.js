// JWT Utility Functions for Role-Based Validation
export const jwtUtils = {
  // Extract role from JWT token
  getRoleFromToken: (token) => {
    try {
      if (!token) return null;
      
      // Split token to get payload
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      console.log('🔑 JWT Payload:', payload);
      
      return payload.role || null;
    } catch (error) {
      console.log('❌ JWT decode error:', error);
      return null;
    }
  },

  // Validate if user has required role
  hasRole: (token, requiredRole) => {
    const userRole = jwtUtils.getRoleFromToken(token);
    console.log('🔍 Required Role:', requiredRole);
    console.log('👤 User Role from JWT:', userRole);
    
    return userRole === requiredRole;
  },

  // Check if user is admin
  isAdmin: (token) => {
    return jwtUtils.hasRole(token, 'ADMIN');
  },

  // Check if user is regular user
  isUser: (token) => {
    return jwtUtils.hasRole(token, 'USER');
  }
};
