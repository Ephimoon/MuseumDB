// src/pages/ManageUsers.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserFormModal from '../components/UserFormModal';
import ChangePasswordModal from '../components/AdminResetPasswordModal';
import styles from '../css/ManageUsers.module.css';
import HomeNavBar from './HomeNavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [userToChangePassword, setUserToChangePassword] = useState(null);

    // New state variables for filters
    const [filterFirstName, setFilterFirstName] = useState('');
    const [filterLastName, setFilterLastName] = useState('');
    const [filterUsername, setFilterUsername] = useState('');
    const [filterEmail, setFilterEmail] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchUsers();
    }, []);

    // Reset currentPage when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [
        users,
        filterFirstName,
        filterLastName,
        filterUsername,
        filterEmail,
        filterRole,
        filterStatus,
    ]);

    const fetchUsers = () => {
        axios.get(`http://localhost:5000/users`, {
            headers: { role, 'user-id': userId },
        })
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                toast.error('Failed to fetch users.');
            });
    };

    const openFormModal = (user = null) => {
        setSelectedUser(user);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setUserToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDelete = (user, isHardDelete) => {
        const endpoint = isHardDelete
            ? `http://localhost:5000/users/${user.user_id}`
            : `http://localhost:5000/users/${user.user_id}/soft-delete`;

        const method = isHardDelete ? 'delete' : 'put';

        axios({
            method,
            url: endpoint,
            headers: { role, 'user-id': userId },
        })
            .then(() => {
                fetchUsers();
                cancelDelete();
                toast.success(`User ${isHardDelete ? 'hard deleted' : 'soft deleted'} successfully.`);
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user.');
            });
    };

    const handleRestore = (user) => {
        const endpoint = `http://localhost:5000/users/${user.user_id}/restore`;

        axios.put(endpoint, {}, {
            headers: { role, 'user-id': userId },
        })
            .then(() => {
                fetchUsers();
                toast.success('User restored successfully.');
            })
            .catch(error => {
                console.error('Error restoring user:', error);
                toast.error('Failed to restore user.');
            });
    };

    const openPasswordModal = (user) => {
        setUserToChangePassword(user);
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setUserToChangePassword(null);
        setIsPasswordModalOpen(false);
    };

    // Filter users based on filter criteria
    const filteredUsers = users.filter(user => {
        const matchesFirstName = user.first_name.toLowerCase().includes(filterFirstName.toLowerCase());
        const matchesLastName = user.last_name.toLowerCase().includes(filterLastName.toLowerCase());
        const matchesUsername = user.username.toLowerCase().includes(filterUsername.toLowerCase());
        const matchesEmail = user.email.toLowerCase().includes(filterEmail.toLowerCase());
        const matchesRole = filterRole ? user.role_name === filterRole : true;
        const matchesStatus = filterStatus
            ? filterStatus === 'Active'
                ? Number(user.is_deleted) === 0
                : Number(user.is_deleted) === 1
            : true;
        return matchesFirstName && matchesLastName && matchesUsername && matchesEmail && matchesRole && matchesStatus;
    });

    // Calculate total pages and current users to display
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsersToDisplay = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Extract unique roles for filter dropdown
    const uniqueRoles = [...new Set(users.map(user => user.role_name))];

    // Clear filters
    const clearFilters = () => {
        setFilterFirstName('');
        setFilterLastName('');
        setFilterUsername('');
        setFilterEmail('');
        setFilterRole('');
        setFilterStatus('');
        toast.info('Filters cleared.');
    };

    return (
        <div className={styles.adminContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Manage Users</h1>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
                <button className={styles.addButton} onClick={() => openFormModal()}>
                    Add New User
                </button>
            </div>

            {/* Filter Section */}
            <div className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterFirstName">First Name:</label>
                    <input
                        type="text"
                        id="filterFirstName"
                        value={filterFirstName}
                        onChange={(e) => setFilterFirstName(e.target.value)}
                        placeholder="Search by first name"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterLastName">Last Name:</label>
                    <input
                        type="text"
                        id="filterLastName"
                        value={filterLastName}
                        onChange={(e) => setFilterLastName(e.target.value)}
                        placeholder="Search by last name"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterUsername">Username:</label>
                    <input
                        type="text"
                        id="filterUsername"
                        value={filterUsername}
                        onChange={(e) => setFilterUsername(e.target.value)}
                        placeholder="Search by username"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterEmail">Email:</label>
                    <input
                        type="text"
                        id="filterEmail"
                        value={filterEmail}
                        onChange={(e) => setFilterEmail(e.target.value)}
                        placeholder="Search by email"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterRole">Role:</label>
                    <select
                        id="filterRole"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="">All</option>
                        {uniqueRoles.map((roleName, index) => (
                            <option key={index} value={roleName}>
                                {roleName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterStatus">Status:</label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Deleted">Deleted</option>
                    </select>
                </div>
                <button
                    className={styles.clearButton}
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>

            {/* User Table */}
            <table className={styles.userTable}>
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentUsersToDisplay.map(user => (
                    <tr key={user.user_id}>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role_name}</td>
                        <td>{Number(user.is_deleted) === 1 ? 'Deleted' : 'Active'}</td>
                        <td>
                            <button className={styles.actionButton} onClick={() => openFormModal(user)}>Edit</button>
                            <button className={styles.actionButton} onClick={() => openPasswordModal(user)}>Change Password</button>
                            {Number(user.is_deleted) === 0 ? (
                                <button className={styles.actionButton} onClick={() => confirmDelete(user)}>Delete</button>
                            ) : (
                                <button className={styles.actionButton} onClick={() => handleRestore(user)}>Restore</button>
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

            {/* Modals */}
            {isFormModalOpen && (
                <UserFormModal
                    user={selectedUser}
                    onClose={closeFormModal}
                />
            )}

            {isPasswordModalOpen && (
                <ChangePasswordModal
                    open={isPasswordModalOpen}
                    onClose={closePasswordModal}
                    userId={userToChangePassword.user_id}
                    role={role}
                    isAdmin={true}
                />
            )}

            {showDeleteModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.closeButton} onClick={cancelDelete}>&times;</span>
                        <h2>Confirm Deletion</h2>
                        <p>Do you want to soft delete or permanently delete this user?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={() => handleDelete(userToDelete, false)}>Soft Delete</button>
                            <button className={styles.formButton} onClick={() => handleDelete(userToDelete, true)}>Hard Delete</button>
                            <button className={styles.formButton} onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
