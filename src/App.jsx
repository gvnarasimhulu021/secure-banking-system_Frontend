import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppNavbar from './components/AppNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AccountDetails from './pages/AccountDetails';
import DepositWithdraw from './pages/DepositWithdraw';
import Transactions from './pages/Transactions';
import NotFound from './pages/NotFound';
import { getToken, getUserRole, isTokenValid } from './services/authService';

function App() {
    const token = getToken();
    const role = getUserRole();
    const activeToken = token && isTokenValid() ? token : null;

    return (
        <div className="min-vh-100 bg-light">
            <AppNavbar />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable theme="colored" />
            <main className="container py-4">
                <Routes>
                    <Route
                        path="/"
                        element={
                            activeToken ? (
                                <Navigate to={role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <AccountDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/deposit-withdraw"
                        element={
                            <ProtectedRoute>
                                <DepositWithdraw />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <ProtectedRoute>
                                <Transactions />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
