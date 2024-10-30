// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import styles from '../css/AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalSales: 0,
        totalOrders: 0,
    });
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // Fetch dashboard statistics
        axios.get('http://cosc3380museum-api-gsd9hhaygpcze8eu.centralus-01.azurewebsites.net/admin/stats', {
            headers: { 'user-id': userId, role },
        })
            .then(response => setStats(response.data))
            .catch(error => console.error('Error fetching admin stats:', error));
    }, [userId, role]);

    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <div className={styles.content}>
                <h1>Admin Dashboard</h1>
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <h2>Total Users</h2>
                        <p>{stats.totalUsers}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h2>Total Sales</h2>
                        <p>${stats.totalSales.toFixed(2)}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h2>Total Orders</h2>
                        <p>{stats.totalOrders}</p>
                    </div>
                </div>
                {/* Add more admin dashboard content here */}
            </div>
        </div>
    );
};

export default AdminDashboard;
