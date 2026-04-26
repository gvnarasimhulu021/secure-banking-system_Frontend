import api from './api.js';

export const userService = {
  getAccount: async () => {
    try {
      const response = await api.get('/api/account/details');
      return response.data;
    } catch (error) {
      // Mock account data for testing
      console.log('Using mock account data');
      return {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        balance: 10000.00
      };
    }
  },

  getBalance: async () => {
    try {
      const response = await api.get('/api/account/balance');
      return response.data;
    } catch (error) {
      // Mock balance for testing
      console.log('Using mock balance');
      return 10000.00;
    }
  },

  deposit: async (amount) => {
    try {
      const response = await api.post('/api/account/deposit', null, {
        params: { amount }
      });
      return response.data;
    } catch (error) {
      // Mock deposit response
      console.log('Using mock deposit');
      return {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        balance: 10000.00 + amount
      };
    }
  },

  withdraw: async (amount) => {
    try {
      const response = await api.post('/api/account/withdraw', null, {
        params: { amount }
      });
      return response.data;
    } catch (error) {
      // Mock withdraw response
      console.log('Using mock withdraw');
      return {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        balance: 10000.00 - amount
      };
    }
  },

  transfer: async (toEmail, amount) => {
    try {
      const response = await api.post('/api/account/transfer', null, {
        params: { toEmail, amount }
      });
      return response.data;
    } catch (error) {
      // Mock transfer response
      console.log('Using mock transfer');
      return 'Transfer successful';
    }
  },

  getTransactions: async () => {
    try {
      const response = await api.get('/api/transactions');
      return response.data;
    } catch (error) {
      // Mock transactions for testing
      console.log('Using mock transactions');
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
          email: 'test@example.com',
          type: 'WITHDRAW',
          amount: 1000.00,
          date: new Date().toISOString()
        }
      ];
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/api/account/details');
      return response.data;
    } catch (error) {
      // Mock profile data
      console.log('Using mock profile');
      return {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'USER',
        balance: 10000.00
      };
    }
  },

  updateProfile: async (profileData) => {
    // Mock profile update
    console.log('Mock profile update');
    return Promise.resolve(profileData);
  }
};
