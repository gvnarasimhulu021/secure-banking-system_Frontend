import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { adminService } from '../../services/adminService.js';

const RoleControl = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setSearchLoading(true);
    setError('');
    setSelectedUser(null);
    setNewRole('');

    try {
      const allUsers = await adminService.getUsers();
      const foundUser = allUsers.find(user => 
        user.email.toLowerCase() === searchEmail.toLowerCase().trim()
      );

      if (foundUser) {
        setSelectedUser(foundUser);
        setNewRole(foundUser.role);
      } else {
        setError('User not found with this email address');
      }
    } catch (err) {
      setError('Error searching for user');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !newRole) {
      setError('Please select a user and role');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminService.updateRole({ 
        userId: selectedUser.id, 
        role: newRole 
      });
      
      setSuccess('Role updated successfully');
      setSelectedUser({ ...selectedUser, role: newRole });
      fetchUsers(); // Refresh the users list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    return role === 'ADMIN' 
      ? 'bg-amber-bg text-amber-text' 
      : 'bg-light-blue-bg text-info-blue';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Role Control" />
        
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

          {/* Search Section */}
          <div className="bg-white rounded-card border-[0.5px] border-gray-200 p-6 mb-6">
            <h3 className="text-[16px] font-medium text-gray-900 mb-4">Search User by Email</h3>
            
            <div className="flex space-x-3 mb-4">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter user email address..."
                className="flex-1 h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
              />
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="px-6 py-2 bg-medium-green text-white text-[13px] font-medium rounded-small hover:bg-primary transition-colors disabled:opacity-50"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* User Card */}
            {selectedUser && (
              <div className="bg-gray-50 rounded-small p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-[14px] font-medium text-gray-900">{selectedUser.name}</h4>
                    <p className="text-[12px] text-gray-500">{selectedUser.email}</p>
                  </div>
                  <span className={`px-3 py-1 text-[11px] font-medium rounded-small ${getRoleBadge(selectedUser.role)}`}>
                    {selectedUser.role}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] text-gray-700 mb-1">Select New Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full h-9 px-3 text-[13px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
                    >
                      <option value="">Select role</option>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRoleUpdate}
                    disabled={loading || !newRole || newRole === selectedUser.role}
                    className="w-full h-9 bg-medium-green text-white text-[13px] font-medium rounded-small hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Role'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* All Users List */}
          <div className="bg-white rounded-card border-[0.5px] border-gray-200">
            <h3 className="text-[16px] font-medium text-gray-900 p-4 border-b border-gray-100">
              All Users ({users.length})
            </h3>
            
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[13px] font-medium text-gray-900">{user.name}</div>
                      <div className="text-[12px] text-gray-500">{user.email}</div>
                    </div>
                    <span className={`px-3 py-1 text-[11px] font-medium rounded-small ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-[12px] text-gray-500">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleControl;
