import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { adminService } from '../../services/adminService.js';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await adminService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    switch (filter) {
      case 'Deposit':
        return transactions.filter(t => t.type === 'DEPOSIT');
      case 'Withdrawal':
        return transactions.filter(t => t.type === 'WITHDRAWAL');
      case 'Transfer':
        return transactions.filter(t => t.type === 'TRANSFER');
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
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const filteredTransactions = getFilteredTransactions();
  const totalPages = getTotalPages();
  const paginatedTransactions = getPaginatedTransactions();

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Transactions Management" />
        
        <div className="p-6">
          {/* Filter Chips */}
          <div className="mb-6 flex space-x-2">
            {['All', 'Deposit', 'Withdrawal', 'Transfer'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => {
                  setFilter(filterOption);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-[13px] font-medium border rounded-small transition-colors ${
                  filter === filterOption
                    ? 'bg-light-green-bg border-medium-green text-primary'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-card border-[0.5px] border-gray-200">
            {paginatedTransactions.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-5 p-4 border-b border-gray-100 text-[12px] font-medium text-gray-700">
                  <div>ID</div>
                  <div>Account</div>
                  <div>Type</div>
                  <div className="text-right">Amount</div>
                  <div className="text-right">Date</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {paginatedTransactions.map((transaction) => (
                    <div key={transaction.id} className="grid grid-cols-5 p-4 text-[13px]">
                      <div className="text-gray-900 font-medium">#{transaction.id}</div>
                      <div className="text-gray-600">{transaction.account || 'N/A'}</div>
                      <div>
                        <span className={`px-2 py-1 text-[11px] font-medium rounded-small ${getTypeBadge(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </div>
                      <div className="text-right">{formatAmount(transaction.amount, transaction.type)}</div>
                      <div className="text-right">
                        <div className="text-gray-900 text-[12px]">{formatDate(transaction.createdAt)}</div>
                        <div className="text-gray-500 text-[11px]">{formatTime(transaction.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-[12px] text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-[12px] border border-gray-200 rounded-small hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-[12px] text-gray-600">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-[12px] border border-gray-200 rounded-small hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-500 text-[14px]">No transactions found</div>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="mt-4 text-medium-green text-[13px] hover:underline"
                >
                  Go to dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
