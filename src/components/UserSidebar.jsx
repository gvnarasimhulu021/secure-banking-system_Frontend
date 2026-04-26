import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const UserSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'ACC · XXXX XXXX';
    const formatted = accountNumber.toString().replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    return `ACC · ${formatted}`;
  };

  const menuItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/user/deposit', label: 'Deposit', icon: '⬇️' },
    { path: '/user/withdraw', label: 'Withdraw', icon: '⬆️' },
    { path: '/user/transfer', label: 'Transfer', icon: '↔️' },
    { path: '/user/transactions', label: 'Transactions', icon: '📋' },
    { path: '/user/profile', label: 'Profile', icon: '👤' }
  ];

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100 fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-medium-green rounded-lg flex items-center justify-center pulse-once">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <div className="font-medium text-gray-900">Narsi Bank</div>
            <div className="text-xs text-gray-500">Secure Banking</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-100 slide-in-left">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <span className="text-gray-600 font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm sidebar-item ${
                isActive(item.path)
                  ? 'bg-light-green-bg text-primary font-medium active'
                  : 'text-gray-600'
              }`}
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
