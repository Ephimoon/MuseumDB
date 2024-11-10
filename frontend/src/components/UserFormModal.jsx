// src/components/UserFormModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/UserFormModal.module.css';
import ChangePasswordModal from './ChangePasswordModal';

const UserFormModal = ({ user, onClose }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        username: '',
        email: '',
        role_id: 3, // Default to 'customer'
    });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                date_of_birth: user.date_of_birth || '',
                username: user.username || '',
                email: user.email || '',
                role_id: user.role_id || 3,
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'role_id' ? parseInt(value, 10) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (user && user.user_id) {
                // Update existing user
                await axios.put(`${process.env.REACT_APP_API_URL}//users/${user.user_id}`, formData, {
                    headers: {
                        role: role,
                        'user-id': userId,
                    },
                });
            } else {
                // Create new user
                await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error appropriately
        }
    };

    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>
                    &times;
                </span>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <h2>{user && user.user_id ? 'Edit User' : 'Add New User'}</h2>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={user && user.user_id} // Disable if editing
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Role:
                        <select
                            name="role_id"
                            value={formData.role_id}
                            onChange={handleChange}
                        >
                            <option value={1}>Admin</option>
                            <option value={2}>Staff</option>
                            <option value={3}>Customer</option>
                            <option value={4}>Member</option>
                        </select>
                    </label>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.formButton}>
                            {user && user.user_id ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            className={styles.formButton}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        {user && user.user_id && (
                            <button
                                type="button"
                                className={styles.formButton}
                                onClick={openPasswordModal}
                            >
                                Change Password
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {isPasswordModalOpen && (
                <ChangePasswordModal
                    open={isPasswordModalOpen}
                    onClose={closePasswordModal}
                    userId={user.user_id}
                    role={role}
                    isAdmin={true}
                />
            )}
        </div>
    );
};

export default UserFormModal;
