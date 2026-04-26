import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar.jsx';
import Topbar from '../../components/Topbar.jsx';
import { adminService } from '../../services/adminService.js';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Mock audit logs data since backend might not have this endpoint
      const mockLogs = [
        {
          id: 1,
          action: 'USER_LOGIN',
          user: 'admin@example.com',
          details: 'Admin logged in successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          ip: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          id: 2,
          action: 'USER_CREATED',
          user: 'admin@example.com',
          details: 'Created new user: john@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          ip: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          id: 3,
          action: 'ROLE_CHANGED',
          user: 'admin@example.com',
          details: 'Changed role for jane@example.com to ADMIN',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          ip: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          id: 4,
          action: 'USER_LOGIN_FAILED',
          user: 'unknown@example.com',
          details: 'Failed login attempt - invalid password',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          ip: '192.168.1.105',
          status: 'FAILED'
        },
        {
          id: 5,
          action: 'ACCOUNT_UPDATED',
          user: 'admin@example.com',
          details: 'Updated balance for user: mike@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          ip: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          id: 6,
          action: 'TRANSACTION_VIEWED',
          user: 'admin@example.com',
          details: 'Viewed transaction history for all users',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          ip: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          id: 7,
          action: 'USER_DELETED',
          user: 'admin@example.com',
          details: 'Deleted user: olduser@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          ip: '192.168.1.100',
          status: 'SUCCESS'
        },
        {
          id: 8,
          action: 'SYSTEM_BACKUP',
          user: 'system',
          details: 'Automated system backup completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          ip: 'localhost',
          status: 'SUCCESS'
        }
      ];
      
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLogs = () => {
    let filtered = logs;
    
    if (filter !== 'All') {
      filtered = filtered.filter(log => log.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    const icons = {
      'USER_LOGIN': '🔑',
      'USER_LOGIN_FAILED': '🚫',
      'USER_CREATED': '👤',
      'USER_DELETED': '🗑️',
      'ROLE_CHANGED': '🔄',
      'ACCOUNT_UPDATED': '💰',
      'TRANSACTION_VIEWED': '📊',
      'SYSTEM_BACKUP': '💾'
    };
    return icons[action] || '📋';
  };

  const getStatusColor = (status) => {
    return status === 'SUCCESS' 
      ? 'text-green-600 bg-green-50' 
      : 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading audit logs...</div>
        </div>
      </div>
    );
  }

  const filteredLogs = getFilteredLogs();

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Topbar title="Audit Logs" />
        
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">System Audit Logs</h1>
            <p className="text-gray-600">Monitor all system activities and security events</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="All">All</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchLogs}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                            <span className="text-sm font-medium text-gray-900">{log.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.ip}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                        No audit logs found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Audit Summary</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Logs:</span>
                <span className="ml-2 font-medium">{logs.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Successful:</span>
                <span className="ml-2 font-medium text-green-600">
                  {logs.filter(log => log.status === 'SUCCESS').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Failed:</span>
                <span className="ml-2 font-medium text-red-600">
                  {logs.filter(log => log.status === 'FAILED').length}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Filtered:</span>
                <span className="ml-2 font-medium">{filteredLogs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
