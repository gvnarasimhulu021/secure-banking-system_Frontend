import { useEffect, useState } from 'react';
import api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function AccountDetails() {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccount = async () => {
            setError('');
            setLoading(true);

            try {
                const response = await api.get('/api/account/details');
                setAccount(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load account details.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccount();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Fetching account details..." />;
    }

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="container">
                <div className="row gy-4">
                    {/* Header */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body p-4">
                                <h1 className="mb-2" style={{ color: '#667eea', fontSize: '2.5rem', fontWeight: '700' }}>
                                    📋 Account Details
                                </h1>
                                <p className="text-muted mb-0">Complete information about your account</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="col-12">
                            <ErrorAlert message={error} />
                        </div>
                    )}

                    {account ? (
                        <>
                            {/* Main Balance Card */}
                            <div className="col-md-6">
                                <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%)' }}>
                                    <div className="card-body p-4">
                                        <p className="text-muted mb-2">💰 Current Balance</p>
                                        <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#27ae60', margin: '0' }}>
                                            {account.currency || '$'}{account.balance?.toFixed?.(2) ?? account.balance}
                                        </p>
                                        <small className="text-muted">Available funds</small>
                                    </div>
                                </div>
                            </div>

                            {/* Account Number Card */}
                            <div className="col-md-6">
                                <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%)' }}>
                                    <div className="card-body p-4">
                                        <p className="text-muted mb-2">🔢 Account Number</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3498db', margin: '0', letterSpacing: '2px' }}>
                                            {account.accountNumber}
                                        </p>
                                        <small className="text-muted">Unique identifier</small>
                                    </div>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div className="col-md-6">
                                <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                                    <div className="card-body p-4">
                                        <p className="text-muted mb-2">💳 Account Type</p>
                                        <p style={{ fontSize: '1.3rem', fontWeight: '600', color: '#667eea', margin: '0' }}>
                                            {account.type || account.accountType || 'Savings'}
                                        </p>
                                        <small className="text-muted">Account category</small>
                                    </div>
                                </div>
                            </div>

                            {/* Branch */}
                            <div className="col-md-6">
                                <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                                    <div className="card-body p-4">
                                        <p className="text-muted mb-2">🏢 Branch</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', margin: '0' }}>
                                            {account.branch || 'Main Branch'}
                                        </p>
                                        <small className="text-muted">Branch location</small>
                                    </div>
                                </div>
                            </div>

                            {/* Opened Date */}
                            <div className="col-12">
                                <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                                    <div className="card-body p-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="text-muted mb-2">📅 Account Opened</p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333', margin: '0' }}>
                                                    {account.openedAt
                                                        ? new Date(account.openedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                        : 'N/A'
                                                    }
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="text-muted mb-2">✅ Status</p>
                                                <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#27ae60', margin: '0' }}>
                                                    ● {account.status || 'Active'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="col-12">
                            <div className="card dashboard-card border-0 text-center p-5" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)' }}>
                                <p className="text-muted mb-0">Account information was not returned by the server.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountDetails;
