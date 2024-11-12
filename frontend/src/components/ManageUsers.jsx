// src/pages/ManageUsers.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserFormModal from '../components/UserFormModal';
import ChangePasswordModal from '../components/AdminResetPasswordModal';
import styles from '../css/ManageUsers.module.css';
import HomeNavBar from './HomeNavBar';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [userToChangePassword, setUserToChangePassword] = useState(null);

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: { role, 'user-id': userId },
        })
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
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
        // Ensure the base URL is included
        const baseURL = '${process.env.REACT_APP_API_URL}';
        const endpoint = isHardDelete
            ? `${baseURL}/users/${user.user_id}`
            : `${baseURL}/users/${user.user_id}/soft-delete`;

        const method = isHardDelete ? 'delete' : 'put';

        axios({
            method,
            url: endpoint,
            headers: { role, 'user-id': userId },
        })
            .then(() => {
                fetchUsers();
                cancelDelete();
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const handleRestore = (user) => {
        const endpoint = `${process.env.REACT_APP_API_URL}/users/${user.user_id}/restore`;

        axios.put(endpoint, {}, {
            headers: { role, 'user-id': userId },
        })
            .then(() => fetchUsers())
            .catch(error => console.error('Error restoring user:', error));
    };

    const openPasswordModal = (user) => {
        setUserToChangePassword(user);
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setUserToChangePassword(null);
        setIsPasswordModalOpen(false);
    };

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
            <div className={styles.adminContainer}>
                <HomeNavBar />
                <h1 className={styles.title}>Manage Users</h1>
                <button className={styles.addButton} onClick={() => openFormModal()}>
                    Add New User
                </button>

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
                    {users.map(user => (
                        <tr key={user.user_id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role_name}</td>
                            <td>{user.is_deleted ? 'Deleted' : 'Active'}</td>
                            <td>
                                <button className={styles.actionButton} onClick={() => openFormModal(user)}>Edit</button>
                                <button className={styles.actionButton} onClick={() => openPasswordModal(user)}>Change Password</button>
                                {user.is_deleted ? (
                                    <button className={styles.actionButton} onClick={() => handleRestore(user)}>Restore</button>
                                ) : (
                                    <button className={styles.actionButton} onClick={() => confirmDelete(user)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

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
        </div>
    );
};

export default ManageUsers;
