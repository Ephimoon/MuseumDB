// src/pages/EmailLogs.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/GiftShopAdmin.module.css'; // Reuse existing styles
import HomeNavBar from './HomeNavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailLogs = () => {
    const [emailLogs, setEmailLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust as needed

    // Fetch email logs from the backend
    const fetchEmailLogs = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/email-logs`)
            .then((response) => {
                setEmailLogs(response.data);
                toast.success('Email logs fetched successfully!');
            })
            .catch((error) => {
                console.error('Error fetching email logs:', error);
                toast.error('Failed to fetch email logs.');
            });
    };

    useEffect(() => {
        fetchEmailLogs();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(emailLogs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = emailLogs.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.adminContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Email Logs for Inventory Alerts</h1>
            <table className={styles.itemTable}>
                <thead>
                <tr>
                    <th>Created At</th>
                    <th>Processed At</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Supplier Name</th>
                    <th>Supplier Email</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {currentLogs.map((log) => (
                    <tr key={log.id}>
                        <td>{new Date(log.created_at).toLocaleString()}</td>
                        <td>
                            {log.processed_at
                                ? new Date(log.processed_at).toLocaleString()
                                : 'Pending'}
                        </td>
                        <td>{log.item_name}</td>
                        <td>{log.quantity}</td>
                        <td>{log.supplier_name}</td>
                        <td>{log.supplier_email}</td>
                        <td>{log.processed ? 'Sent' : 'Pending'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`${styles.pageButton} ${
                            currentPage === index + 1 ? styles.activePage : ''
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmailLogs;
