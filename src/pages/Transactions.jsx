import { useEffect, useState } from 'react';
import api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            setError('');
            setLoading(true);

            try {
                const response = await api.get('/api/transactions');
                setTransactions(response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load transactions.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return <LoadingSpinner message="Loading transactions..." />;
    }

    const getTransactionColor = (type) => {
        if (!type) return '';
        const typeStr = type.toLowerCase();
        if (typeStr.includes('deposit')) return 'text-success';
        if (typeStr.includes('withdraw')) return 'text-danger';
        return '';
    };

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) return '₹0.00';
        return `₹${Math.abs(parseFloat(amount)).toFixed(2)}`;
    };

    const formatDate = (date) => {
        if (!date) return '-';
        try {
            return new Date(date).toLocaleString();
        } catch {
            return date;
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
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h1 className="mb-2" style={{ color: '#667eea', fontSize: '2.5rem', fontWeight: '700' }}>
                                            📊 Transaction History
                                        </h1>
                                        <p className="text-muted mb-0">View all your account transactions</p>
                                    </div>
                                    <div className="badge rounded-pill" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '10px 15px', fontSize: '1rem' }}>
                                        {transactions.length} transactions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="col-12">
                            <ErrorAlert message={error} />
                        </div>
                    )}

                    <div className="col-12">
                        <div className="card dashboard-card border-0" style={{ borderRadius: '20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', overflow: 'hidden' }}>
                            {transactions && transactions.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead style={{ background: '#f8f9fa' }}>
                                            <tr>
                                                <th className="fw-600 text-muted" style={{ padding: '15px 20px' }}>📅 Date</th>
                                                <th className="fw-600 text-muted" style={{ padding: '15px 20px' }}>Type</th>
                                                <th className="fw-600 text-muted text-end" style={{ padding: '15px 20px' }}>💰 Amount</th>
                                                {transactions[0]?.balance !== undefined && (
                                                    <th className="fw-600 text-muted text-end" style={{ padding: '15px 20px' }}>💳 Balance</th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction, index) => (
                                                <tr
                                                    key={transaction.id || index}
                                                    style={{ transition: 'all 0.3s', borderBottom: '1px solid #e0e0e0' }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = '#f8f9fa';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = 'transparent';
                                                    }}
                                                >
                                                    <td className="text-muted" style={{ padding: '15px 20px' }}>
                                                        {formatDate(transaction.date)}
                                                    </td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <span
                                                            className={`badge ${getTransactionColor(transaction.type)
                                                                .includes('success')
                                                                ? 'bg-success'
                                                                : 'bg-danger'
                                                                }`}
                                                            style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                                                        >
                                                            {transaction.type?.includes('DEPOSIT') ? '📈' : '📉'} {transaction.type || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td className={`fw-600 text-end ${getTransactionColor(transaction.type)}`} style={{ padding: '15px 20px', fontSize: '1.1rem' }}>
                                                        {transaction.type?.includes('DEPOSIT') ? '+' : '-'}{formatAmount(transaction.amount)}
                                                    </td>
                                                    {transaction.balance !== undefined && (
                                                        <td className="fw-600 text-end" style={{ padding: '15px 20px', color: '#667eea' }}>
                                                            ₹{transaction.balance.toFixed(2)}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-5 text-center">
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
                                    <p className="text-muted mb-0">No transactions yet. Start by making a deposit or withdrawal!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
