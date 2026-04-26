import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { adminService } from '../../services/adminService.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    if (!searchTerm) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.updateRole({ userId, role: newRole });
      setSuccess('Role updated successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.deleteUser(userId);
      setSuccess('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
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

  const filteredUsers = getFilteredUsers();

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Users Management" />
        
        <div className="p-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-light-green-bg border-[0.5px] border-medium-green text-primary rounded-small text-[13px]">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-light-red-bg border-[0.5px] border-danger text-danger rounded-small text-[13px]">
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full max-w-md h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
            />
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-card border-[0.5px] border-gray-200">
            {filteredUsers.length > 0 ? (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-4 p-4 border-b border-gray-100 text-[12px] font-medium text-gray-700">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="grid grid-cols-4 p-4 text-[13px] items-center">
                      <div className="text-gray-900 font-medium">{user.name}</div>
                      <div className="text-gray-600">{user.email}</div>
                      <div>
                        <span className={`px-2 py-1 text-[10px] font-medium rounded-small ${
                          user.role === 'ADMIN' 
                            ? 'bg-amber-bg text-amber-text' 
                            : 'bg-light-blue-bg text-info-blue'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <select
                          defaultValue={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={actionLoading}
                          className="px-2 py-1 text-[11px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={actionLoading}
                          className="px-2 py-1 text-[11px] bg-light-red-bg text-danger border-[0.5px] border-danger rounded-small hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="text-gray-500 text-[14px]">
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
