function LoadingSpinner({ message = 'Loading, please wait...' }) {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-secondary">{message}</p>
        </div>
    );
}

export default LoadingSpinner;
