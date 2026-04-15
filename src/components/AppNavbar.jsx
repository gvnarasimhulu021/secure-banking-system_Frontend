import { Link, NavLink, useNavigate } from 'react-router-dom';
import { getToken, getUserRole, getUserName, logout, isTokenValid } from '../services/authService';

function AppNavbar() {
    const token = getToken();
    const role = getUserRole();
    const userName = getUserName();
    const isAuthenticated = token && isTokenValid();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div className="container">
                <div className="d-flex flex-column">
                    <Link
                        className="navbar-brand"
                        to="/"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 18px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.35)',
                            background: 'rgba(255,255,255,0.12)',
                            fontFamily: 'Inter, system-ui, sans-serif',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            fontSize: '1.15rem',
                            color: 'white',
                            textDecoration: 'none'
                        }}
                    >
                        {isAuthenticated ? `Hello, ${userName || 'Member'}` : 'Narsi Frnd Of Joy'}
                    </Link>
                    {isAuthenticated && (
                        <small className="text-white-50 mt-1" style={{ fontSize: '0.82rem' }}>
                            Narsi Frnd Of Joy Banking
                        </small>
                    )}
                </div>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated && role === 'USER' && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/dashboard">
                                        Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/account">
                                        Account
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/deposit-withdraw">
                                        Deposit & Withdraw
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/transactions">
                                        Transactions
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {isAuthenticated && role === 'ADMIN' && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin">
                                    Admin Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <span className="badge bg-light text-dark">{role}</span>
                                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-light btn-sm" to="/login">
                                    Login
                                </Link>
                                <Link className="btn btn-outline-light btn-sm" to="/register">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AppNavbar;
