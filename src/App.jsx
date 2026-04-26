import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// User Pages
import Dashboard from './pages/user/Dashboard.jsx';
import Deposit from './pages/user/Deposit.jsx';
import Withdraw from './pages/user/Withdraw.jsx';
import Transfer from './pages/user/Transfer.jsx';
import Transactions from './pages/user/Transactions.jsx';
import Profile from './pages/user/Profile.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Users from './pages/admin/Users.jsx';
import Accounts from './pages/admin/Accounts.jsx';
import AdminTransactions from './pages/admin/AdminTransactions.jsx';
import RoleControl from './pages/admin/RoleControl.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/user/deposit" element={
            <PrivateRoute>
              <Deposit />
            </PrivateRoute>
          } />
          <Route path="/user/withdraw" element={
            <PrivateRoute>
              <Withdraw />
            </PrivateRoute>
          } />
          <Route path="/user/transfer" element={
            <PrivateRoute>
              <Transfer />
            </PrivateRoute>
          } />
          <Route path="/user/transactions" element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } />
          <Route path="/user/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } />
          <Route path="/admin/accounts" element={
            <AdminRoute>
              <Accounts />
            </AdminRoute>
          } />
          <Route path="/admin/transactions" element={
            <AdminRoute>
              <AdminTransactions />
            </AdminRoute>
          } />
          <Route path="/admin/role-control" element={
            <AdminRoute>
              <RoleControl />
            </AdminRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <AdminRoute>
              <AuditLogs />
            </AdminRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
