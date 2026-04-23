import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login as loginRequest, saveToken, saveUserProfile, getUserRole, isTokenValid } from '../services/authService';
import api from '../services/apiService';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastDetails, setToastDetails] = useState({ message: '', type: 'success' });
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (isTokenValid()) {
            const role = getUserRole();
            navigate(role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginRequest({ email, password });
            if (!data?.token) {
                throw new Error('Authentication failed. Token not returned.');
            }

            saveToken(data.token);
            const profileResponse = await api.get('/user/profile', {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            });
            saveUserProfile(profileResponse.data);

            setToastDetails({ message: '✅ Login successful! Redirecting...', type: 'success' });
            setShowToast(true);

            setTimeout(() => {
                const role = getUserRole();
                const redirectUrl = role === 'ADMIN' ? '/admin' : '/dashboard';
                navigate(from === '/login' ? redirectUrl : from, { replace: true });
            }, 1000);
        } catch (err) {
            const status = err.response?.status;
            const responseData = err.response?.data;
            const serverMessage = typeof responseData === 'string' ? responseData : responseData?.message;
            const message =
                status === 400
                    ? 'Invalid credentials. Please try again.'
                    : serverMessage || err.message || 'Unable to login.';

            setError(message);
            setToastDetails({ message, type: 'error' });
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showToast && (
                <Toast
                    message={toastDetails.message}
                    type={toastDetails.type}
                    duration={2500}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div
                className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated background elements */}
                <div
                    style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        top: '-100px',
                        left: '-100px',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        width: '200px',
                        height: '200px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '50%',
                        bottom: '-50px',
                        right: '-50px',
                        animation: 'float 8s ease-in-out infinite'
                    }}
                />

                <div className="row w-100 justify-content-center px-3" style={{ zIndex: 1 }}>
                    <div className="col-12 col-md-8 col-lg-5">
                        <div
                            className="card shadow-lg border-0"
                            style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                transform: 'translateY(0)',
                                animation: 'slideUp 0.6s ease-out'
                            }}
                        >
                            <div
                                className="card-body p-5"
                                style={{ background: '#fff' }}
                            >
                                <div className="text-center mb-4">
                                    <div
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto',
                                            color: 'white',
                                            fontSize: '28px'
                                        }}
                                    >
                                        🔐
                                    </div>
                                </div>

                                <h2 className="card-title text-center mb-2" style={{ fontWeight: '700', color: '#333' }}>
                                    Welcome Back
                                </h2>
                                <p className="text-center text-secondary mb-4">
                                    Sign in to your secure banking account
                                </p>

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>⚠️ Error:</strong> {error}
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setError('')}
                                        />
                                    </div>
                                )}

                                {loading ? (
                                    <LoadingSpinner message="Signing in..." />
                                ) : (
                                    <>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="email" className="form-label" style={{ fontWeight: '500', color: '#333' }}>
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    style={{
                                                        borderRadius: '10px',
                                                        border: '2px solid #e0e0e0',
                                                        padding: '12px 16px',
                                                        fontSize: '15px',
                                                        transition: 'border-color 0.3s'
                                                    }}
                                                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                                                    onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="password" className="form-label" style={{ fontWeight: '500', color: '#333' }}>
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    style={{
                                                        borderRadius: '10px',
                                                        border: '2px solid #e0e0e0',
                                                        padding: '12px 16px',
                                                        fontSize: '15px',
                                                        transition: 'border-color 0.3s'
                                                    }}
                                                    onFocus={(e) => (e.target.style.borderColor = '#667eea')}
                                                    onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn w-100"
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    padding: '12px',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    fontSize: '16px',
                                                    transition: 'transform 0.2s, box-shadow 0.2s'
                                                }}
                                                onMouseDown={(e) => {
                                                    e.currentTarget.style.transform = 'scale(0.98)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.4)';
                                                }}
                                                onMouseUp={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                                                }}
                                            >
                                                Sign In
                                            </button>
                                        </form>

                                        <div className="text-center mt-4">
                                            <p className="text-secondary mb-2">New to Secure Banking?</p>
                                            <Link
                                                to="/register"
                                                className="btn btn-outline-primary w-100"
                                                style={{
                                                    borderRadius: '10px',
                                                    borderWidth: '2px',
                                                    fontWeight: '600',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                Create Account
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(20px); }
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>
        </>
    );
}

export default LoginPage;
