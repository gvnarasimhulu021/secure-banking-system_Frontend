import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerRequest, saveToken, saveUserProfile, getUserRole } from '../services/authService';
import api from '../services/apiService';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                fullName,
                email,
                password
            };
            console.log('Register payload:', JSON.stringify(payload));
            const response = await registerRequest(payload);
            console.log('Register response:', response);

            if (!response?.token) {
                throw new Error('Registration succeeded but token was not returned.');
            }

            saveToken(response.token);
            const profileResponse = await api.get('/user/profile');
            saveUserProfile(profileResponse.data);
            setShowToast(true);

            setTimeout(() => {
                const role = getUserRole();
                navigate(role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
            }, 2000);
        } catch (err) {
            console.error('❌ Registration error:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            
            let errorMessage = 'Registration failed.';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (typeof err.response?.data === 'string') {
                errorMessage = err.response.data;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showToast && <Toast message="🎉 Account created successfully! Redirecting..." type="success" duration={2000} />}

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
                            <div className="card-body p-5" style={{ background: '#fff' }}>
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
                                        📝
                                    </div>
                                </div>

                                <h2 className="card-title text-center mb-2" style={{ fontWeight: '700', color: '#333' }}>
                                    Create Account
                                </h2>
                                <p className="text-center text-secondary mb-4">
                                    Join Secure Banking today in seconds
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
                                    <LoadingSpinner message="Creating your account..." />
                                ) : (
                                    <>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="fullName" className="form-label" style={{ fontWeight: '500', color: '#333' }}>
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    id="fullName"
                                                    className="form-control"
                                                    placeholder="Your full name"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
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
                                                <small className="text-muted d-block mt-2">At least 6 characters</small>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="confirmPassword" className="form-label" style={{ fontWeight: '500', color: '#333' }}>
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    className="form-control"
                                                    placeholder="••••••••"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                                Create Account
                                            </button>
                                        </form>

                                        <div className="text-center mt-4">
                                            <p className="text-secondary mb-0">
                                                Already have an account?{' '}
                                                <Link
                                                    to="/login"
                                                    style={{
                                                        color: '#667eea',
                                                        textDecoration: 'none',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    Sign In
                                                </Link>
                                            </p>
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
            `}</style>
        </>
    );
}

export default RegisterPage;
