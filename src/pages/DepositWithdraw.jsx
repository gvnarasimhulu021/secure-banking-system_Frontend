import { useEffect, useState } from 'react';
import api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function DepositWithdraw() {
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await api.get('/account/details');
            setBalance(response.data.balance);
        } catch (err) {
            setError('Unable to fetch account balance.');
        }
    };

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Enter a valid amount.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post(`/account/deposit?amount=${parseFloat(amount)}`);
            setBalance(response.data.balance);
            setSuccess(`✅ Deposit of $${amount} successful!`);
            setAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Deposit failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Enter a valid amount.');
            return;
        }

        if (parseFloat(amount) > balance) {
            setError('Insufficient balance.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await api.post(`/account/withdraw?amount=${parseFloat(amount)}`);
            setBalance(response.data.balance);
            setSuccess(`✅ Withdrawal of $${amount} successful!`);
            setAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Withdrawal failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row gy-4">
            <div className="col-12">
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <h3 className="card-title">Deposit & Withdraw</h3>
                        <p className="text-muted mb-0">Manage your account funds.</p>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card shadow-sm h-100">
                    <div className="card-header bg-info text-white">Current Balance</div>
                    <div className="card-body text-center">
                        {balance !== null ? (
                            <>
                                <h2 className="display-6 text-success">${balance.toFixed(2)}</h2>
                                <p className="text-muted">Available balance</p>
                            </>
                        ) : (
                            <LoadingSpinner message="Loading balance..." />
                        )}
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card shadow-sm h-100">
                    <div className="card-header bg-primary text-white">Transaction</div>
                    <div className="card-body">
                        {error && <ErrorAlert message={error} />}
                        {success && (
                            <div className="alert alert-success" role="alert">
                                {success}
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="amount" className="form-label">
                                Amount ($)
                            </label>
                            <input
                                type="number"
                                id="amount"
                                className="form-control"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                step="0.01"
                                min="0"
                                disabled={loading}
                            />
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-success"
                                onClick={handleDeposit}
                                disabled={loading || !amount}
                            >
                                {loading ? 'Processing...' : '💰 Deposit'}
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleWithdraw}
                                disabled={loading || !amount}
                            >
                                {loading ? 'Processing...' : '💸 Withdraw'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DepositWithdraw;
