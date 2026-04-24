import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await api.get('/api/admin/users');
            setUsers(response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load users.');
            toast.error('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, userEmail) => {
        if (!window.confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
            return;
        }

        setDeleteLoading(userId);

        try {
            await api.delete(`/api/admin/delete?id=${userId}`);
            toast.success(`User ${userEmail} deleted successfully.`);
            await fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setDeleteLoading(null);
        }
    };

    return (
        <div className="row gy-4">
            <div className="col-12">
                <div
                    className="card shadow-sm border-0"
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
                >
                    <div className="card-body">
                        <h3 className="card-title mb-1">👨‍💼 Admin Dashboard</h3>
                        <p className="mb-0" style={{ opacity: 0.9 }}>
                            Manage system users and monitor account activity.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="col-12">
                    <ErrorAlert message={error} />
                </div>
            )}

            <div className="col-12">
                <div className="card shadow-sm border-0">
                    <div className="card-header" style={{ background: '#f8f9fa', fontWeight: '600', padding: '20px' }}>
                        📊 User Management
                        <span className="badge bg-primary float-end">{users.length} users</span>
                    </div>
                    <div className="card-body p-0">
                        {loading ? (
                            <LoadingSpinner message="Loading users..." />
                        ) : users && users.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Balance</th>
                                            <th scope="col" className="text-end">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id || user.email}>
                                                <td className="fw-600">
                                                    {user.firstName && user.lastName
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.fullName || user.name || 'N/A'}
                                                </td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-info'
                                                            }`}
                                                    >
                                                        {user.role || 'USER'}
                                                    </span>
                                                </td>
                                                <td className="fw-600 text-success">
                                                    ₹{user.balance?.toFixed(2) ?? '0.00'}
                                                </td>
                                                <td className="text-end">
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDeleteUser(user.id, user.email)}
                                                        disabled={deleteLoading === user.id}
                                                        title="Delete user"
                                                    >
                                                        {deleteLoading === user.id ? (
                                                            <>
                                                                <span
                                                                    className="spinner-border spinner-border-sm me-2"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                ></span>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            'Delete'
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-5 text-center">
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
                                <p className="text-muted mb-0">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
