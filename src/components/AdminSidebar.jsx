import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/accounts', label: 'Accounts', icon: '🏦' },
    { path: '/admin/transactions', label: 'Transactions', icon: '💸' },
    { path: '/admin/role-control', label: 'Role Control', icon: '🔑' },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📋' }
  ];

  return (
    <div className="w-[196px] bg-primary min-h-screen flex flex-col">
      {/* Top Section */}
      <div className="p-4 border-b border-white/10">
        <div className="mb-3">
          <div className="text-white text-[13px] font-medium">Narsi Frnd of Joy</div>
          <div className="text-white/50 text-[11px]">Admin Portal</div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 text-[13px] transition-colors ${
                isActive
                  ? 'bg-white/12 border-l-2 border-accent text-white'
                  : 'text-white/70 hover:bg-white/7'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-white/8 border border-white/15 text-white/70 hover:bg-red-500/20 hover:text-red-300 rounded-small transition-colors text-[13px]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
