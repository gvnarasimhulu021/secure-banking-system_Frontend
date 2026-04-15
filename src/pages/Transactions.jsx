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
                const response = await api.get('/transactions');
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
        if (amount === null || amount === undefined) return '$0.00';
        return `$${Math.abs(parseFloat(amount)).toFixed(2)}`;
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
        <div className="row justify-content-center">
            <div className="col-12 col-lg-11">
                <div className="card shadow-sm border-0">
                    <div
                        className="card-header text-white"
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        <h5 className="mb-0">📊 Transaction History</h5>
                    </div>
                    <div className="card-body p-0">
                        {error && <ErrorAlert message={error} />}
                        {transactions && transactions.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="fw-600">Date</th>
                                            <th className="fw-600">Transaction Type</th>
                                            <th className="fw-600 text-end">Amount</th>
                                            {transactions[0]?.balance !== undefined && (
                                                <th className="fw-600 text-end">Balance</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction, index) => (
                                            <tr key={transaction.id || index}>
                                                <td className="small text-muted">
                                                    {formatDate(transaction.date)}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${getTransactionColor(transaction.type)
                                                                .includes('success')
                                                                ? 'bg-success'
                                                                : 'bg-danger'
                                                            }`}
                                                    >
                                                        {transaction.type || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className={`fw-600 text-end ${getTransactionColor(transaction.type)}`}>
                                                    {formatAmount(transaction.amount)}
                                                </td>
                                                {transaction.balance !== undefined && (
                                                    <td className="fw-600 text-end text-primary">
                                                        {formatAmount(transaction.balance)}
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 text-center">
                                <div style={{ fontSize: '3rem' }}>📭</div>
                                <p className="text-muted mt-3 mb-0">No transactions found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
