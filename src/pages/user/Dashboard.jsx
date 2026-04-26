import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Dashboard = () => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when component regains focus (for balance updates after transactions)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchData = async () => {
    try {
      const [accountData, transactionsData] = await Promise.all([
        userService.getAccount(),
        userService.getTransactions()
      ]);
      setAccount(accountData);
      setTransactions(transactionsData);
      
      // Mock user data update - removed direct mutation to prevent React errors
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    if (filter === 'All') return transactions;
    if (filter === 'Credit') return transactions.filter(t => t.type === 'DEPOSIT');
    if (filter === 'Debit') return transactions.filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER');
    return transactions;
  };

  const getRecentTransactions = () => {
    return getFilteredTransactions().slice(0, 5);
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const credited = monthTransactions
      .filter(t => t.type === 'DEPOSIT')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const debited = monthTransactions
      .filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')
      .reduce((sum, t) => sum + t.amount, 0);

    return { credited, debited, net: credited - debited };
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return '⬇️';
      case 'WITHDRAWAL':
        return '⬆️';
      case 'TRANSFER':
        return '↔️';
      default:
        return '📋';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'DEPOSIT':
        return 'bg-light-green-bg text-primary';
      case 'WITHDRAWAL':
        return 'bg-light-red-bg text-danger';
      case 'TRANSFER':
        return 'bg-light-blue-bg text-info-blue';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'DEPOSIT' ? '+' : '-';
    const color = type === 'DEPOSIT' ? 'text-primary' : 'text-danger';
    return (
      <span className={`text-[13px] font-medium ${color}`}>
        {prefix}₹{amount.toLocaleString()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="text-lg font-medium">Loading...</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const monthlyStats = getMonthlyStats();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6">Narsi Frnd of Joy Bank</h2>
        <nav className="space-y-2">
          <button className="w-full text-left px-3 py-2 rounded bg-green-100 text-green-700">Dashboard</button>
          <button onClick={() => navigate('/user/deposit')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Deposit</button>
          <button onClick={() => navigate('/user/withdraw')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Withdraw</button>
          <button onClick={() => navigate('/user/transfer')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Transfer</button>
          <button onClick={() => { console.log('Transactions clicked from Dashboard'); navigate('/user/transactions'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Transactions</button>
        </nav>
        
        {/* Logout Button */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="logout-button w-full text-left px-4 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.name || 'User'}!</h2>
          <p className="text-gray-600 mb-4">Your current balance</p>
          <div className="text-3xl font-bold text-green-600">
            ₹{account?.balance?.toLocaleString() || '10,000.00'}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => navigate('/user/deposit')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-medium">Deposit</div>
          </button>
          <button 
            onClick={() => navigate('/user/withdraw')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">💸</div>
            <div className="font-medium">Withdraw</div>
          </button>
          <button 
            onClick={() => navigate('/user/transfer')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">↔️</div>
            <div className="font-medium">Transfer</div>
          </button>
          <button 
            onClick={() => navigate('/user/transactions')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-2">📋</div>
            <div className="font-medium">History</div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <div className="font-medium">{transaction.type}</div>
                    <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-bold ${transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'DEPOSIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
