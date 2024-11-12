// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnnouncementFormModal from '../../components/AnnouncementFormModal';
import styles from '../../css/AdminDashBoard.module.css';
import HomeNavBar from '../../components/HomeNavBar';

const AdminDashboard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [announcementToRestore, setAnnouncementToRestore] = useState(null);

    // New state variables for tiles
    const [purchasesToday, setPurchasesToday] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust as needed

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchAnnouncements();
        fetchPurchasesToday();
        fetchRevenueToday();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [announcements]);

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchAnnouncements = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/announcements/all`, {
            headers: { 'user-id': userId, role },
        })
            .then(response => setAnnouncements(response.data))
            .catch(error => console.error('Error fetching announcements:', error));
    };

    // Fetch the number of purchases made today
    const fetchPurchasesToday = () => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

        const reportRequest = {
            report_category: 'GiftShopReport',
            report_type: 'transaction_details',
            report_period_type: 'single_day',
            selected_date: today,
            // Include other filters if needed
        };

        axios.post(`${process.env.REACT_APP_API_URL}/reports`, reportRequest, {
            headers: {
                'Content-Type': 'application/json',
                'user-id': userId,
                role: role,
            },
        })
            .then(response => {
                const reportData = response.data.reportData;
                // Process the reportData to get the number of unique transactions (purchases)
                const transactionIds = new Set();
                if (Array.isArray(reportData)) {
                    reportData.forEach(item => {
                        transactionIds.add(item.transaction_id);
                    });
                }
                setPurchasesToday(transactionIds.size);
            })
            .catch(error => console.error('Error fetching purchases:', error));
    };

    // Fetch the total revenue made today
    const fetchRevenueToday = () => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

        const reportRequest = {
            report_category: 'GiftShopReport',
            report_type: 'revenue',
            report_period_type: 'single_day',
            selected_date: today,
            // Include other filters if needed
        };

        axios.post(`${process.env.REACT_APP_API_URL}/reports`, reportRequest, {
            headers: {
                'Content-Type': 'application/json',
                'user-id': userId,
                role: role,
            },
        })
            .then(response => {
                const reportData = response.data.reportData;
                // Process the reportData to calculate total revenue
                let totalRevenue = 0;
                if (Array.isArray(reportData)) {
                    reportData.forEach(item => {
                        totalRevenue += parseFloat(item.item_total) || 0;
                    });
                }
                setRevenueToday(totalRevenue);
            })
            .catch(error => console.error('Error fetching revenue:', error));
    };

    // Confirm Delete
    const confirmDelete = (id) => {
        setAnnouncementToDelete(id);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setAnnouncementToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDelete = () => {
        axios.delete(`${process.env.REACT_APP_API_URL}/announcements/${announcementToDelete}`, {
            headers: { 'user-id': userId, role },
        })
            .then(() => {
                fetchAnnouncements();
                cancelDelete();
            })
            .catch(error => console.error('Error deleting announcement:', error));
    };

    // Confirm Restore
    const confirmRestore = (id) => {
        setAnnouncementToRestore(id);
        setShowRestoreModal(true);
    };

    const cancelRestore = () => {
        setAnnouncementToRestore(null);
        setShowRestoreModal(false);
    };

    const handleRestore = () => {
        axios.put(`${process.env.REACT_APP_API_URL}/announcements/${announcementToRestore}/restore`, {}, {
            headers: { 'user-id': userId, role },
        })
            .then(() => {
                fetchAnnouncements();
                cancelRestore();
            })
            .catch(error => console.error('Error restoring announcement:', error));
    };

    const openFormModal = (announcement = null) => {
        setSelectedAnnouncement(announcement);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedAnnouncement(null);
        fetchAnnouncements();
    };

    // Pagination logic
    const totalPages = Math.ceil(announcements.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = announcements.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.adminContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Admin Dashboard</h1>

            {/* Tiles Container */}
            <div className={styles.tilesContainer}>
                <div className={styles.tile}>
                    <h2>Purchases Today</h2>
                    <p>{purchasesToday}</p>
                </div>
                <div className={styles.tile}>
                    <h2>Revenue Today</h2>
                    <p>${revenueToday.toFixed(2)}</p>
                </div>
                <div className={styles.tile}>
                    <h2>Current Time</h2>
                    <p>{currentTime.toLocaleString()}</p>
                </div>
            </div>

            <button className={styles.addButton} onClick={() => openFormModal()}>
                Add New Announcement
            </button>

            {/* Announcements Table */}
            <table className={styles.itemTable}>
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Target Audience</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {currentItems.map(announcement => (
                    <tr key={announcement.id}>
                        <td>{announcement.title}</td>
                        <td>{announcement.content}</td>
                        <td>{announcement.target_audience}</td>
                        <td>{announcement.priority}</td>
                        <td>{announcement.is_deleted ? 'Deleted' : 'Active'}</td>
                        <td>
                            <button className={styles.actionButton} onClick={() => openFormModal(announcement)}>Edit</button>
                            {announcement.is_deleted ? (
                                <button
                                    className={styles.actionButton}
                                    onClick={() => confirmRestore(announcement.id)}
                                >
                                    Restore
                                </button>
                            ) : (
                                <button
                                    className={styles.actionButton}
                                    onClick={() => confirmDelete(announcement.id)}
                                >
                                    Delete
                                </button>
                            )}
                        </td>
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
                        className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Announcement Form Modal */}
            {isFormModalOpen && (
                <AnnouncementFormModal
                    announcement={selectedAnnouncement}
                    onClose={closeFormModal}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <span className={styles.close_button} onClick={cancelDelete}>&times;</span>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this announcement?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={handleDelete}>
                                Yes, Delete
                            </button>
                            <button className={styles.formButton} onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Confirmation Modal */}
            {showRestoreModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <span className={styles.close_button} onClick={cancelRestore}>&times;</span>
                        <h2>Confirm Restore</h2>
                        <p>Are you sure you want to restore this announcement?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={handleRestore}>
                                Yes, Restore
                            </button>
                            <button className={styles.formButton} onClick={cancelRestore}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
