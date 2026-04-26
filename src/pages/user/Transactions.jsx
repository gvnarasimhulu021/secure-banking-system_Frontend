import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await userService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    switch (filter) {
      case 'Credit':
        return transactions.filter(t => t.type === 'DEPOSIT');
      case 'Debit':
        return transactions.filter(t => t.type === 'WITHDRAWAL' || t.type === 'TRANSFER');
      default:
        return transactions;
    }
  };

  const getPaginatedTransactions = () => {
    const filtered = getFilteredTransactions();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredTransactions().length / itemsPerPage);
  };

  const getTypeBadge = (type) => {
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
      <span className={`font-medium ${color}`}>
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

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="text-xl font-bold mb-6">Narsi Frnd of Joy Bank</div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading transactions...</div>
        </div>
      </div>
    );
  }

  const filteredTransactions = getFilteredTransactions();
  const totalPages = getTotalPages();
  const paginatedTransactions = getPaginatedTransactions();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6">Narsi Frnd of Joy Bank</h2>
        <nav className="space-y-2">
          <button onClick={() => navigate('/user/dashboard')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Dashboard</button>
          <button onClick={() => navigate('/user/deposit')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Deposit</button>
          <button onClick={() => navigate('/user/withdraw')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Withdraw</button>
          <button onClick={() => navigate('/user/transfer')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Transfer</button>
          <button className="w-full text-left px-3 py-2 rounded bg-green-100 text-green-700">Transactions</button>
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
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

        {/* Filter Chips */}
        <div className="mb-6 flex space-x-2">
          {['All', 'Credit', 'Debit'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => {
                setFilter(filterOption);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                filter === filterOption
                  ? 'bg-green-100 border-green-600 text-green-700'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-5 p-4 text-sm font-medium text-gray-700 border-b bg-gray-50">
                <div>Date</div>
                <div>Type</div>
                <div>Description</div>
                <div className="text-right">Amount</div>
                <div className="text-right">Time</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {paginatedTransactions.map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-5 p-4 text-sm hover:bg-gray-50">
                    <div className="text-gray-900">{formatDate(transaction.date)}</div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        transaction.type === 'DEPOSIT' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <div className="text-gray-900">{transaction.note || transaction.type}</div>
                    <div className="text-right">{formatAmount(transaction.amount, transaction.type)}</div>
                    <div className="text-right text-gray-500 text-xs">{formatTime(transaction.date)}</div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="text-gray-500 text-lg mb-4">No transactions found</div>
              <button
                onClick={() => navigate('/user/dashboard')}
                className="text-green-600 hover:underline font-medium"
              >
                Make your first transaction
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
