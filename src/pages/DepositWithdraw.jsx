import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function DepositWithdraw() {
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [transactionType, setTransactionType] = useState('');

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await api.get('/api/account/details');
            setBalance(response.data.balance);
        } catch (err) {
            setError('Unable to fetch account balance.');
        }
    };

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Enter a valid amount.');
            return;
        }

        setError('');
        setLoading(true);
        setTransactionType('deposit');

        try {
            const response = await api.post(`/api/account/deposit?amount=${parseFloat(amount)}`);
            setBalance(response.data.balance);
            toast.success(`✅ Deposit of $${parseFloat(amount).toFixed(2)} successful!`);
            setAmount('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed.');
        } finally {
            setLoading(false);
            setTransactionType('');
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Enter a valid amount.');
            return;
        }

        if (parseFloat(amount) > balance) {
            toast.error('Insufficient balance.');
            return;
        }

        setError('');
        setLoading(true);
        setTransactionType('withdraw');

        try {
            const response = await api.post(`/api/account/withdraw?amount=${parseFloat(amount)}`);
            setBalance(response.data.balance);
            toast.success(`✅ Withdrawal of $${parseFloat(amount).toFixed(2)} successful!`);
            setAmount('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed.');
        } finally {
            setLoading(false);
            setTransactionType('');
        }
    };

    const handleQuickDeposit = async (quickAmount) => {
        setError('');
        setLoading(true);
        setTransactionType('deposit');

        try {
            const response = await api.post(`/api/account/deposit?amount=${quickAmount}`);
            setBalance(response.data.balance);
            toast.success(`💰 Quick deposit of $${quickAmount} successful!`);
            setAmount('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed.');
        } finally {
            setLoading(false);
            setTransactionType('');
        }
    };

    const handleQuickWithdraw = async (quickAmount) => {
        if ((balance ?? 0) < quickAmount) {
            toast.error('Insufficient balance for this withdrawal.');
            return;
        }

        setError('');
        setLoading(true);
        setTransactionType('withdraw');

        try {
            const response = await api.post(`/api/account/withdraw?amount=${quickAmount}`);
            setBalance(response.data.balance);
            toast.success(`💸 Quick withdrawal of $${quickAmount} successful!`);
            setAmount('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed.');
        } finally {
            setLoading(false);
            setTransactionType('');
        }
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="container py-4">
                <div className="row gy-4">
                    {/* Header */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body p-4">
                                <h1 className="mb-2" style={{ color: '#667eea', fontSize: '2.5rem', fontWeight: '700' }}>
                                    💰 Deposit & Withdraw
                                </h1>
                                <p className="text-muted mb-0">Manage your account funds with ease</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="col-12">
                            <ErrorAlert message={error} />
                        </div>
                    )}

                    {/* Current Balance */}
                    <div className="col-md-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(39, 174, 96, 0.1) 0%, rgba(39, 174, 96, 0.05) 100%)' }}>
                            <div className="card-body p-4 text-center">
                                <p className="text-muted mb-2">💳 Current Balance</p>
                                {balance !== null ? (
                                    <>
                                        <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#27ae60', margin: '0' }}>
                                            ${balance.toFixed(2)}
                                        </p>
                                        <small className="text-muted">Available balance</small>
                                    </>
                                ) : (
                                    <LoadingSpinner message="Loading balance..." />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Info */}
                    <div className="col-md-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%)' }}>
                            <div className="card-body p-4">
                                <p className="text-muted mb-2">⚡ Quick Actions</p>
                                <p style={{ fontSize: '1rem', color: '#333', margin: '0', lineHeight: '1.6' }}>
                                    Use preset amounts for instant transactions, or enter custom amounts below
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Deposit Actions */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">💚 Quick Deposit Buttons</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-2">
                                    {[50, 100, 500, 1000].map((amt) => (
                                        <div key={`dep-${amt}`} className="col-6 col-sm-3">
                                            <button
                                                className="btn btn-light w-100 py-2"
                                                onClick={() => handleQuickDeposit(amt)}
                                                disabled={loading}
                                                style={{ borderRadius: '10px', border: '2px solid #e0e0e0', transition: 'all 0.3s' }}
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
                                                <span style={{ fontWeight: '600', color: '#27ae60' }}>+${amt}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Withdraw Actions */}
                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">❤️ Quick Withdraw Buttons</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-2">
                                    {[50, 100, 500, 1000].map((amt) => (
                                        <div key={`wit-${amt}`} className="col-6 col-sm-3">
                                            <button
                                                className="btn btn-light w-100 py-2"
                                                onClick={() => handleQuickWithdraw(amt)}
                                                disabled={loading || (balance ?? 0) < amt}
                                                style={{ borderRadius: '10px', border: '2px solid #e0e0e0', transition: 'all 0.3s' }}
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
                                                <span style={{ fontWeight: '600', color: '#e74c3c' }}>-${amt}</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Deposit Form */}
                    <div className="col-lg-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">💰 Custom Deposit</h5>
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
                                        placeholder="Enter custom amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={loading}
                                        style={{ borderRadius: '10px', border: '2px solid #e0e0e0', padding: '10px 15px' }}
                                    />
                                </div>
                                <button
                                    className="btn btn-success w-100 py-2"
                                    onClick={handleDeposit}
                                    disabled={loading || !amount}
                                    style={{ borderRadius: '10px', fontWeight: '600' }}
                                >
                                    {loading && transactionType === 'deposit' ? '⏳ Processing...' : '✓ Deposit'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Withdraw Form */}
                    <div className="col-lg-6">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            <div style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', padding: '15px 20px', color: 'white' }}>
                                <h5 className="mb-0">💸 Custom Withdraw</h5>
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
                                        placeholder="Enter custom amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={loading}
                                        style={{ borderRadius: '10px', border: '2px solid #e0e0e0', padding: '10px 15px' }}
                                    />
                                </div>
                                <button
                                    className="btn btn-danger w-100 py-2"
                                    onClick={handleWithdraw}
                                    disabled={loading || !amount}
                                    style={{ borderRadius: '10px', fontWeight: '600' }}
                                >
                                    {loading && transactionType === 'withdraw' ? '⏳ Processing...' : '✓ Withdraw'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepositWithdraw;
