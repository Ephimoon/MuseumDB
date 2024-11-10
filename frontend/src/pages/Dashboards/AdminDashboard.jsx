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

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust as needed

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [announcements]);

    const fetchAnnouncements = () => {
        axios.get('${process.env.REACT_APP_API_URL}/announcements/all', {
            headers: { 'user-id': userId, role },
        })
            .then(response => setAnnouncements(response.data))
            .catch(error => console.error('Error fetching announcements:', error));
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
