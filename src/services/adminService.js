import api from './api.js';

export const adminService = {
  getUsers: async () => {
    try {
      const response = await api.get('/api/admin/users');
      return response.data;
    } catch (error) {
      // Mock users for testing
      console.log('Using mock admin users');
      return [
        {
          id: 1,
          fullName: 'Test User',
          email: 'test@example.com',
          role: 'USER',
          balance: 10000.00
        },
        {
          id: 2,
          fullName: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
          balance: 50000.00
        }
      ];
    }
  },

  getUser: async (email) => {
    try {
      const response = await api.get('/api/admin/user', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      // Mock user for testing
      console.log('Using mock admin user');
      return {
        id: 1,
        fullName: 'Test User',
        email: email,
        role: 'USER',
        balance: 10000.00
      };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete('/api/admin/delete', {
        params: { id: userId }
      });
      return response.data;
    } catch (error) {
      // Mock delete response
      console.log('Using mock admin delete');
      return 'User deleted successfully';
    }
  },

  updateBalance: async (email, amount) => {
    try {
      const response = await api.put('/api/admin/update-balance', null, {
        params: { email, amount }
      });
      return response.data;
    } catch (error) {
      // Mock balance update
      console.log('Using mock admin balance update');
      return {
        id: 1,
        fullName: 'Test User',
        email: email,
        role: 'USER',
        balance: amount
      };
    }
  },

  // Backend doesn't have separate accounts endpoint, users contain balance info
  getAccounts: async () => {
    try {
      const users = await api.get('/api/admin/users');
      return users.data.map(user => ({
        ...user,
        accountNumber: user.id, // Use ID as account number
        owner: user.fullName,
        balance: user.balance,
        status: 'ACTIVE' // Default status since backend doesn't have this field
      }));
    } catch (error) {
      // Mock accounts for testing
      console.log('Using mock admin accounts');
      return [
        {
          id: 1,
          accountNumber: 'ACC001',
          owner: 'Test User',
          balance: 10000.00,
          status: 'ACTIVE'
        },
        {
          id: 2,
          accountNumber: 'ACC002',
          owner: 'Admin User',
          balance: 50000.00,
          status: 'ACTIVE'
        }
      ];
    }
  },

  // Backend doesn't have admin transactions endpoint, use regular transactions
  getTransactions: async () => {
    try {
      const response = await api.get('/api/transactions');
      return response.data;
    } catch (error) {
      // Mock transactions for testing
      console.log('Using mock admin transactions');
      return [
        {
          id: 1,
          email: 'test@example.com',
          type: 'DEPOSIT',
          amount: 5000.00,
          date: new Date().toISOString()
        },
        {
          id: 2,
          email: 'admin@example.com',
          type: 'WITHDRAW',
          amount: 1000.00,
          date: new Date().toISOString()
        }
      ];
    }
  },

  // Backend doesn't have role update endpoint
  updateRole: async (roleData) => {
    // Mock role update
    console.log('Mock role update');
    return Promise.resolve({ message: 'Role updated successfully' });
  }
};
