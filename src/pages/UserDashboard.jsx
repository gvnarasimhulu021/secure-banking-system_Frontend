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

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setError('');
        setLoading(true);

        try {
            const [profileResponse, accountResponse] = await Promise.all([
                api.get('/user/profile'),
                api.get('/account/details')
            ]);

            setProfile(profileResponse.data);
            setAccount(accountResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAccount = async () => {
        try {
            const response = await api.get('/account/details');
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
            const response = await api.post(`/account/deposit?amount=${amount}`);
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
            const response = await api.post(`/account/withdraw?amount=${amount}`);
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
            const response = await api.post(`/account/transfer?toEmail=${encodeURIComponent(email)}&amount=${amount}`);
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


    if (loading) {
        return <LoadingSpinner message="Loading your dashboard..." />;
    }

    const userName = profile?.fullName || profile?.name || 'Customer';
    const userInitials = userName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="container py-4">
            <div className="row gy-4">
                <div className="col-12">
                    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3">
                        <div>
                            <h1 className="mb-2">Welcome back, {userName}</h1>
                            <p className="text-muted mb-0">Your banking dashboard is ready.</p>
                        </div>
                        <div className="badge rounded-pill bg-primary py-2 px-3 text-white">
                            {profile?.role?.toUpperCase() || 'USER'} ACCESS
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="col-12">
                        <ErrorAlert message={error} />
                    </div>
                )}

                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body">
                            <h5 className="card-title">Profile</h5>
                            <p className="text-muted mb-2">Full name</p>
                            <p className="fs-5 fw-semibold mb-3">{userName}</p>
                            <p className="text-muted mb-2">Email</p>
                            <p className="mb-3">{profile?.email || 'Not available'}</p>
                            <p className="text-muted mb-2">Role</p>
                            <p className="mb-0 text-capitalize">{profile?.role || 'user'}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0" style={{ background: '#e9f7ef' }}>
                        <div className="card-body">
                            <h5 className="card-title text-success">Current Balance</h5>
                            <div className="display-6 fw-bold text-success">
                                ${account?.balance?.toFixed(2) ?? '0.00'}
                            </div>
                            <p className="text-muted mb-0">Account number: {account?.accountNumber || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-body">
                            <h5 className="card-title">Account Summary</h5>
                            <p className="text-muted mb-2">Status</p>
                            <p className="mb-3">{account?.status || 'Active'}</p>
                            <p className="text-muted mb-2">Joined</p>
                            <p className="mb-0">
                                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Today'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom px-4 py-3">
                            <h5 className="mb-0">Deposit</h5>
                        </div>
                        <div className="card-body px-4 py-4">
                            <div className="mb-3">
                                <label htmlFor="depositAmount" className="form-label">
                                    Amount ($)
                                </label>
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
                                />
                            </div>
                            <button
                                className="btn btn-success w-100"
                                onClick={handleDeposit}
                                disabled={transactionLoading || !depositAmount}
                            >
                                {transactionLoading ? 'Processing...' : 'Deposit'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom px-4 py-3">
                            <h5 className="mb-0">Withdraw</h5>
                        </div>
                        <div className="card-body px-4 py-4">
                            <div className="mb-3">
                                <label htmlFor="withdrawAmount" className="form-label">
                                    Amount ($)
                                </label>
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
                                />
                            </div>
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleWithdraw}
                                disabled={transactionLoading || !withdrawAmount}
                            >
                                {transactionLoading ? 'Processing...' : 'Withdraw'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom px-4 py-3">
                            <h5 className="mb-0">💸 Transfer Money</h5>
                        </div>
                        <div className="card-body px-4 py-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="transferEmail" className="form-label">
                                        Receiver Email
                                    </label>
                                    <input
                                        id="transferEmail"
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter receiver's email"
                                        value={transferEmail}
                                        onChange={(e) => setTransferEmail(e.target.value)}
                                        disabled={transactionLoading}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="transferAmount" className="form-label">
                                        Amount ($)
                                    </label>
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
                                    />
                                </div>
                            </div>
                            <button
                                className="btn btn-primary w-100 mt-3"
                                onClick={handleTransfer}
                                disabled={transactionLoading || !transferEmail || !transferAmount}
                            >
                                {transactionLoading ? 'Processing...' : 'Transfer Money'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
