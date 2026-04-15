import { useState, useEffect } from 'react';

function Toast({ message, type = 'success', duration = 4000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const bgColor = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info',
        warning: 'bg-warning'
    }[type];

    const icon = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    }[type];

    return (
        <div
            className={`position-fixed top-0 start-50 translate-middle-x mt-3 ${bgColor} text-white px-4 py-3 rounded-3`}
            style={{
                zIndex: 9999,
                minWidth: '300px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                animation: 'slideDown 0.3s ease-out'
            }}
        >
            <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <span>{message}</span>
            </div>
        </div>
    );
}

export default Toast;
