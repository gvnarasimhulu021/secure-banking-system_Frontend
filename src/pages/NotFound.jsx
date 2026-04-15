import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="text-center py-5">
            <h1 className="display-5">404</h1>
            <p className="lead">Page not found.</p>
            <Link to="/" className="btn btn-primary">
                Return to Home
            </Link>
        </div>
    );
}

export default NotFound;
