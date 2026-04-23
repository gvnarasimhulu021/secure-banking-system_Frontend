import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function UserDashboard() {
    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [transferEmail, setTransferEmail] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ totalDeposits: 0, totalWithdrawals: 0, transactionCount: 0 });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setError('');
        setLoading(true);

        try {
            const [profileResponse, accountResponse, transactionsResponse] = await Promise.all([
                api.get('/api/account/details'),
                api.get('/api/account/details'),
                api.get('/api/transactions').catch(() => ({ data: [] }))
            ]);

            setProfile(profileResponse.data);
            setAccount(accountResponse.data);

            // Process transactions
            const txList = transactionsResponse.data || [];
            setTransactions(txList.slice(0, 5)); // Show last 5 transactions

            // Calculate statistics
            if (txList.length > 0) {
                const deposits = txList.filter(tx => tx.type?.includes('DEPOSIT')).reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
                const withdrawals = txList.filter(tx => tx.type?.includes('WITHDRAW')).reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
                setStats({
                    totalDeposits: deposits,
                    totalWithdrawals: withdrawals,
                    transactionCount: txList.length
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAccount = async () => {
        try {
            const response = await api.get('/api/account/details');
            setAccount(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to refresh account details.');
        }
    };

    const handleDeposit = async () => {
        const amount = parseFloat(depositAmount);
        if (Number.isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid deposit amount.');
            return;
        }

        setError('');
        setTransactionLoading(true);

        try {
            const response = await api.post(`/api/account/deposit?amount=${amount}`);
            setAccount((prev) => ({ ...prev, balance: response.data.balance }));
            toast.success(`Deposit successful: $${amount.toFixed(2)} added.`);
            setDepositAmount('');
            await fetchAccount();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed.');
        } finally {
            setTransactionLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);
        if (Number.isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid withdrawal amount.');
            return;
        }

        if (account?.balance != null && amount > account.balance) {
            toast.error('Insufficient balance for this withdrawal.');
            return;
        }

        setError('');
        setTransactionLoading(true);

        try {
            const response = await api.post(`/api/account/withdraw?amount=${amount}`);
            setAccount((prev) => ({ ...prev, balance: response.data.balance }));
            toast.success(`Withdrawal successful: $${amount.toFixed(2)} withdrawn.`);
            setWithdrawAmount('');
            await fetchAccount();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed.');
        } finally {
            setTransactionLoading(false);
        }
    };

    const handleTransfer = async () => {
        const email = transferEmail.trim();
        const amount = parseFloat(transferAmount);

        if (!email) {
            toast.error('Please enter the receiver email address.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (Number.isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid transfer amount.');
            return;
        }

        if (account?.balance != null && amount > account.balance) {
            toast.error('Insufficient balance for this transfer.');
            return;
        }

        setError('');
        setTransactionLoading(true);

        try {
            const response = await api.post(`/api/account/transfer?toEmail=${encodeURIComponent(email)}&amount=${amount}`);
            setAccount((prev) => ({ ...prev, balance: response.data.balance }));
            toast.success(`💸 Money transferred to ${email}`);
            setTransferEmail('');
            setTransferAmount('');
            await fetchAccount();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Transfer failed.');
        } finally {
            setTransactionLoading(false);
        }
    };

    // Quick action handlers for preset amounts
    const handleQuickDeposit = async (amount) => {
        setError('');
        setTransactionLoading(true);

        try {
            const response = await api.post(`/api/account/deposit?amount=${amount}`);
            setAccount((prev) => ({ ...prev, balance: response.data.balance }));
            toast.success(`💰 Quick deposit of $${amount.toFixed(2)} successful!`);
            setDepositAmount('');
            await fetchAccount();
            await loadDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed.');
        } finally {
            setTransactionLoading(false);
        }
    };

    const handleQuickWithdraw = async (amount) => {
        if (account?.balance != null && amount > account.balance) {
            toast.error('Insufficient balance for this withdrawal.');
            return;
        }

        setError('');
        setTransactionLoading(true);

        try {
            const response = await api.post(`/api/account/withdraw?amount=${amount}`);
            setAccount((prev) => ({ ...prev, balance: response.data.balance }));
            toast.success(`💸 Quick withdrawal of $${amount.toFixed(2)} successful!`);
            setWithdrawAmount('');
            await fetchAccount();
            await loadDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed.');
        } finally {
            setTransactionLoading(false);
        }
    };


    const userName = profile?.fullName || profile?.name || 'Customer';
    const userInitials = userName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="dashboard-container" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="container py-4">
                <div className="row gy-4">
                    {/* Header Section */}
                    <div className="col-12">
                        <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '32px',
                                    fontWeight: 'bold',
                                    backdropFilter: 'blur(10px)',
                                    border: '2px solid rgba(255,255,255,0.3)'
                                }}>
                                    {userInitials}
                                </div>
                                <div>
                                    <h1 className="mb-0" style={{ color: 'white', fontSize: '2.5rem', fontWeight: '700' }}>
                                        Welcome, {userName.split(' ')[0]}! 👋
                                    </h1>
                                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
                                        Here's your financial overview
                                    </p>
                                </div>
                            </div>
                            <div className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', fontSize: '0.95rem', backdropFilter: 'blur(10px)' }}>
                                🔐 {profile?.role?.toUpperCase() || 'USER'} ACCESS
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="col-12">
                            <ErrorAlert message={error} />
                        </div>
                    )}

                    {/* Primary Balance Card */}
                    <div className="col-12 col-lg-5">
                        <div className="card dashboard-card border-0" style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            overflow: 'hidden'
                        }}>
                            <div className="card-body p-4">
                                <p className="text-muted mb-2">💰 Current Balance</p>
                                <div style={{ fontSize: '3rem', fontWeight: '800', color: '#667eea', marginBottom: '10px' }}>
                                    ${account?.balance?.toFixed(2) ?? '0.00'}
                                </div>
                                <p className="mb-3" style={{ color: '#666', fontSize: '0.95rem' }}>
                                    Account: {account?.accountNumber || 'N/A'}
                                </p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span className="badge" style={{ background: '#e9f7ef', color: '#27ae60', fontSize: '0.85rem', padding: '8px 12px' }}>
                                        ✓ {account?.status || 'Active'}
                                    </span>
                                    <span className="badge" style={{ background: '#fef5e7', color: '#f39c12', fontSize: '0.85rem', padding: '8px 12px' }}>
                                        📊 {stats.transactionCount} transactions
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="col-12 col-lg-7">
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <div className="card dashboard-card border-0" style={{ background: 'linear-gradient(135deg, rgba(46, 204, 113, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%)', borderRadius: '15px' }}>
                                    <div className="card-body p-3">
                                        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>📈 Total Deposits</p>
                                        <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#27ae60', margin: '0' }}>
                                            ${stats.totalDeposits.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="card dashboard-card border-0" style={{ background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%)', borderRadius: '15px' }}>
                                    <div className="card-body p-3">
                                        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>📉 Total Withdrawals</p>
                                        <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#e74c3c', margin: '0' }}>
                                            ${stats.totalWithdrawals.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body p-4">
                                <h5 className="mb-3">⚡ Quick Actions</h5>
                                <div className="row g-2">
                                    {[50, 100, 500, 1000].map((amount) => (
                                        <div key={`dep-${amount}`} className="col-6 col-sm-3">
                                            <button
                                                className="btn btn-light w-100 py-2"
                                                onClick={() => handleQuickDeposit(amount)}
                                                disabled={transactionLoading}
                                                style={{ borderRadius: '10px', transition: 'all 0.3s', border: '2px solid #e0e0e0' }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.background = '#e9f7ef';
                                                    e.target.style.borderColor = '#27ae60';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = '#fff';
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#27ae60' }}>+${amount}</span>
                                            </button>
                                        </div>
                                    ))}
                                    {[50, 100, 500, 1000].map((amount) => (
                                        <div key={`wit-${amount}`} className="col-6 col-sm-3">
                                            <button
                                                className="btn btn-light w-100 py-2"
                                                onClick={() => handleQuickWithdraw(amount)}
                                                disabled={transactionLoading || (account?.balance ?? 0) < amount}
                                                style={{ borderRadius: '10px', transition: 'all 0.3s', border: '2px solid #e0e0e0' }}
                                                onMouseEnter={(e) => {
                                                    if (!e.target.disabled) {
                                                        e.target.style.background = '#fadbd8';
                                                        e.target.style.borderColor = '#e74c3c';
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.2)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.background = '#fff';
                                                    e.target.style.borderColor = '#e0e0e0';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e74c3c' }}>-${amount}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile & Account Cards */}
                    <div className="col-md-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body p-4">
                                <h5 className="mb-3">👤 Profile Information</h5>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Full Name</p>
                                        <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{userName}</p>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Email Address</p>
                                        <p style={{ fontWeight: '500', fontSize: '0.95rem', color: '#667eea' }}>{profile?.email || 'Not available'}</p>
                                    </div>
                                    <div className="col-12">
                                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Account Type</p>
                                        <p style={{ fontWeight: '600', color: '#667eea' }}>
                                            {account?.type || account?.accountType || 'Savings'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body p-4">
                                <h5 className="mb-3">📋 Account Details</h5>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Account Number</p>
                                        <p style={{ fontWeight: '600', fontSize: '1.1rem', letterSpacing: '1px' }}>{account?.accountNumber || 'N/A'}</p>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Status</p>
                                        <p style={{ fontWeight: '600', color: '#27ae60' }}>● {account?.status || 'Active'}</p>
                                    </div>
                                    <div className="col-12">
                                        <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Member Since</p>
                                        <p style={{ fontWeight: '500' }}>
                                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Today'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deposit Card */}
                    <div className="col-lg-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">💰 Deposit Money</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label htmlFor="depositAmount" className="form-label">Amount ($)</label>
                                    <input
                                        id="depositAmount"
                                        type="number"
                                        className="form-control"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter deposit amount"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        disabled={transactionLoading}
                                        style={{ borderRadius: '10px', border: '2px solid #e0e0e0', padding: '10px 15px' }}
                                    />
                                </div>
                                <button
                                    className="btn btn-success w-100 py-2"
                                    onClick={handleDeposit}
                                    disabled={transactionLoading || !depositAmount}
                                    style={{ borderRadius: '10px', fontWeight: '600' }}
                                >
                                    {transactionLoading ? '⏳ Processing...' : '✓ Deposit'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Withdraw Card */}
                    <div className="col-lg-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">💸 Withdraw Money</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label htmlFor="withdrawAmount" className="form-label">Amount ($)</label>
                                    <input
                                        id="withdrawAmount"
                                        type="number"
                                        className="form-control"
                                        step="0.01"
                                        min="0"
                                        placeholder="Enter withdrawal amount"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        disabled={transactionLoading}
                                        style={{ borderRadius: '10px', border: '2px solid #e0e0e0', padding: '10px 15px' }}
                                    />
                                </div>
                                <button
                                    className="btn btn-danger w-100 py-2"
                                    onClick={handleWithdraw}
                                    disabled={transactionLoading || !withdrawAmount}
                                    style={{ borderRadius: '10px', fontWeight: '600' }}
                                >
                                    {transactionLoading ? '⏳ Processing...' : '✓ Withdraw'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transfer Card */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">🔄 Transfer Money</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="transferEmail" className="form-label">Receiver Email</label>
                                        <input
                                            id="transferEmail"
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter receiver's email"
                                            value={transferEmail}
                                            onChange={(e) => setTransferEmail(e.target.value)}
                                            disabled={transactionLoading}
                                            style={{ borderRadius: '10px', border: '2px solid #e0e0e0', padding: '10px 15px' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="transferAmount" className="form-label">Amount ($)</label>
                                        <input
                                            id="transferAmount"
                                            type="number"
                                            className="form-control"
                                            step="0.01"
                                            min="0"
                                            placeholder="Enter amount"
                                            value={transferAmount}
                                            onChange={(e) => setTransferAmount(e.target.value)}
                                            disabled={transactionLoading}
                                            style={{ borderRadius: '10px', border: '2px solid #e0e0e0', padding: '10px 15px' }}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-primary w-100 mt-3 py-2"
                                    onClick={handleTransfer}
                                    disabled={transactionLoading || !transferEmail || !transferAmount}
                                    style={{ borderRadius: '10px', fontWeight: '600' }}
                                >
                                    {transactionLoading ? '⏳ Processing...' : '✓ Transfer Money'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">📊 Recent Transactions</h5>
                            </div>
                            <div className="card-body p-0">
                                {transactions.length > 0 ? (
                                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {transactions.map((tx, index) => (
                                            <div
                                                key={index}
                                                className="d-flex justify-content-between align-items-center p-3"
                                                style={{
                                                    borderBottom: index < transactions.length - 1 ? '1px solid #e0e0e0' : 'none',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = '#f8f9fa';
                                                    e.currentTarget.style.paddingLeft = '20px';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.paddingLeft = '12px';
                                                }}
                                            >
                                                <div>
                                                    <p className="mb-1" style={{ fontWeight: '600' }}>
                                                        {tx.type || 'Transaction'}
                                                    </p>
                                                    <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                                                        {tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p className="mb-0" style={{
                                                        fontWeight: '700',
                                                        fontSize: '1.1rem',
                                                        color: tx.type?.includes('DEPOSIT') ? '#27ae60' : '#e74c3c'
                                                    }}>
                                                        {tx.type?.includes('DEPOSIT') ? '+' : '-'}${Math.abs(parseFloat(tx.amount) || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-muted">
                                        <p className="mb-0">No transactions yet</p>
                                        <small>Your transactions will appear here</small>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
