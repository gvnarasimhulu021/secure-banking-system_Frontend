import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [account, setAccount] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      const accountData = await userService.getAccount();
      setAccount(accountData);
    } catch (error) {
      console.error('Error fetching account:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(false);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (account && withdrawAmount > account.balance) {
      setError('Insufficient balance. Available balance: ₹' + account.balance.toLocaleString());
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await userService.withdraw(withdrawAmount);
      
      setSuccess(`Successfully withdrew ₹${amount} from your account`);
      setAmount('');
      setNote('');
      fetchAccount(); // Refresh account balance
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    // Clear error if amount is valid
    if (value && parseFloat(value) > 0 && account && parseFloat(value) <= account.balance) {
      setError('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6">Narsi Frnd of Joy Bank</h2>
        <nav className="space-y-2">
          <button onClick={() => navigate('/user/dashboard')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Dashboard</button>
          <button onClick={() => navigate('/user/deposit')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Deposit</button>
          <button className="w-full text-left px-3 py-2 rounded bg-green-100 text-green-700">Withdraw</button>
          <button onClick={() => navigate('/user/transfer')} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Transfer</button>
          <button onClick={() => { console.log('Transactions clicked from Withdraw'); navigate('/user/transactions'); }} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Transactions</button>
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
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Withdraw Money</h1>
          <p className="text-gray-600 mb-6">Access your funds anytime</p>

          {/* Current Balance */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-green-600">
              ₹{account?.balance?.toLocaleString() || '10,000.00'}
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Withdraw Money'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
