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
                const response = await api.get('/account/details');
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
        <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
                <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">Account Details</div>
                    <div className="card-body">
                        {error && <ErrorAlert message={error} />}
                        {account ? (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <h6>Account Number</h6>
                                    <p>{account.accountNumber}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h6>Account Type</h6>
                                    <p>{account.type || account.accountType}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h6>Balance</h6>
                                    <p>
                                        {account.currency || '$'} {account.balance?.toFixed?.(2) ?? account.balance}
                                    </p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h6>Branch</h6>
                                    <p>{account.branch || 'Main Branch'}</p>
                                </div>
                                <div className="col-12">
                                    <h6>Available Since</h6>
                                    <p>{account.openedAt || 'N/A'}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted">Account information was not returned by the server.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountDetails;
