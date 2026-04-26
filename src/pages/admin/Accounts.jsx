import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { adminService } from '../../services/adminService.js';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await adminService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAccounts = () => {
    if (!searchTerm) return accounts;
    return accounts.filter(account => 
      account.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber?.toString().includes(searchTerm)
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
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  const filteredAccounts = getFilteredAccounts();

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Accounts Management" />
        
        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by owner name or account number..."
              className="w-full max-w-md h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
            />
          </div>

          {/* Accounts Table */}
          <div className="bg-white rounded-card border-[0.5px] border-gray-200">
            {filteredAccounts.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-6 p-4 border-b border-gray-100 text-[12px] font-medium text-gray-700">
                  <div>Account No</div>
                  <div>Owner</div>
                  <div>Type</div>
                  <div>Balance</div>
                  <div>Status</div>
                  <div>Opened On</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {filteredAccounts.map((account) => (
                    <div key={account.accountNumber} className="grid grid-cols-6 p-4 text-[13px] items-center">
                      <div className="text-gray-900 font-medium">{account.accountNumber}</div>
                      <div className="text-gray-600">{account.owner || 'N/A'}</div>
                      <div className="text-gray-600">{account.accountType || 'Savings'}</div>
                      <div className="text-gray-900 font-medium">₹{account.balance?.toLocaleString() || '0'}</div>
                      <div>
                        <span className={`px-2 py-1 text-[10px] font-medium rounded-small ${
                          account.status === 'ACTIVE' 
                            ? 'bg-light-green-bg text-primary' 
                            : 'bg-light-red-bg text-danger'
                        }`}>
                          {account.status || 'ACTIVE'}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {account.createdAt ? formatDate(account.createdAt) : 'Jan 10, 2024'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-500 text-[14px]">
                  {searchTerm ? 'No accounts found matching your search' : 'No accounts found'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts;
