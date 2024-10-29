import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <button onClick={handleLogout} style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}>
            Logout
        </button>
    );
}
