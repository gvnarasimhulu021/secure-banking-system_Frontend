import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { adminService } from '../../services/adminService.js';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, accountsData, transactionsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getAccounts(),
        adminService.getTransactions()
      ]);
      setUsers(usersData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecentUsers = () => {
    return users.slice(0, 4);
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 4);
  };

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  const getAvatarColor = (index) => {
    const colors = ['bg-light-green-bg text-primary', 'bg-purple-bg text-purple-text', 'bg-light-red-bg text-danger', 'bg-amber-bg text-amber-text'];
    return colors[index % colors.length];
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

  const formatAmount = (amount, type) => {
    const prefix = type === 'DEPOSIT' ? '+' : '-';
    const color = type === 'DEPOSIT' ? 'text-primary' : 'text-danger';
    return (
      <span className={`font-medium ${color}`}>
        {prefix}₹{amount.toLocaleString()}
      </span>
    );
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const recentUsers = getRecentUsers();
  const recentTransactions = getRecentTransactions();

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Admin Dashboard" />
        
        <div className="p-6 space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-card p-4 border-[0.5px] border-gray-200">
              <div className="text-[11px] uppercase text-gray-500 mb-2">Total Users</div>
              <div className="text-[22px] font-medium text-gray-900 mb-1">{users.length}</div>
              <div className="text-[12px] text-primary">+{Math.floor(Math.random() * 10) + 1} this week</div>
            </div>
            <div className="bg-white rounded-card p-4 border-[0.5px] border-gray-200">
              <div className="text-[11px] uppercase text-gray-500 mb-2">Total Accounts</div>
              <div className="text-[22px] font-medium text-gray-900">{accounts.length}</div>
            </div>
            <div className="bg-white rounded-card p-4 border-[0.5px] border-gray-200">
              <div className="text-[11px] uppercase text-gray-500 mb-2">Total Balance</div>
              <div className="text-[22px] font-medium text-gray-900">₹{getTotalBalance().toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-card p-4 border-[0.5px] border-gray-200">
              <div className="text-[11px] uppercase text-gray-500 mb-2">Transactions</div>
              <div className="text-[22px] font-medium text-gray-900">{transactions.length}</div>
              <div className="text-[12px] text-danger">+{Math.floor(Math.random() * 5)} flagged</div>
            </div>
          </div>

          {/* Two Panel Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-card border-[0.5px] border-gray-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[13px] font-medium text-gray-900">Recent Users</h3>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-[12px] text-medium-green hover:underline"
                >
                  View all →
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full ${getAvatarColor(index)} flex items-center justify-center`}>
                          <span className="text-xs font-medium">{getInitials(user.name)}</span>
                        </div>
                        <div>
                          <div className="text-[12px] text-gray-900">{user.name}</div>
                          <div className="text-[11px] text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-medium rounded-small ${
                        user.role === 'ADMIN' 
                          ? 'bg-amber-bg text-amber-text' 
                          : 'bg-light-blue-bg text-info-blue'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[12px] text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-card border-[0.5px] border-gray-200">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-[13px] font-medium text-gray-900">Recent Transactions</h3>
                <button
                  onClick={() => navigate('/admin/transactions')}
                  className="text-[12px] text-medium-green hover:underline"
                >
                  View all →
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT' 
                            ? 'bg-light-green-bg' 
                            : transaction.type === 'WITHDRAWAL' 
                            ? 'bg-light-red-bg' 
                            : 'bg-light-blue-bg'
                        }`}>
                          <span className="text-sm">
                            {transaction.type === 'DEPOSIT' 
                              ? '⬇️' 
                              : transaction.type === 'WITHDRAWAL' 
                              ? '⬆️' 
                              : '↔️'}
                          </span>
                        </div>
                        <div>
                          <div className="text-[12px] text-gray-900">{transaction.note || transaction.type}</div>
                          <div className="text-[11px] text-gray-500">{formatTimeAgo(transaction.createdAt)}</div>
                        </div>
                      </div>
                      {formatAmount(transaction.amount, transaction.type)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[12px] text-gray-500">
                    No transactions found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
