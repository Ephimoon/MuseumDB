// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ roles }) => {
    const role = localStorage.getItem('role');
    console.log('User role:', role);
    console.log('Allowed roles:', roles);

    if (!role) {
        // User is not logged in
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(role.toLowerCase())) {
        // User does not have the required role
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
