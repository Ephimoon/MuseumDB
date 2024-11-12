// src/components/UserFormModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/UserFormModal.module.css';
import ChangePasswordModal from './ChangePasswordModal';

const UserFormModal = ({ user, onClose }) => {
    // Initialize form data with camelCase field names
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        username: '',
        email: '',
        roleId: 3, // Default to 'Customer'
        password: '',
        confirmPassword: '',
    });

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [error, setError] = useState('');

    // Retrieve role and userId from localStorage
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                dateOfBirth: user.date_of_birth || '',
                username: user.username || '',
                email: user.email || '',
                roleId: user.role_id || 3,
                password: '', // Reset password fields when editing
                confirmPassword: '',
            });
        }
    }, [user]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'roleId' ? parseInt(value, 10) : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state

        // Password validation when creating a new user
        if (!user || !user.user_id) {
            if (!formData.password || !formData.confirmPassword) {
                setError('Please enter and confirm the password.');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return;
            }
        }

        // Prepare payload with camelCase field names
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            username: formData.username,
            email: formData.email,
            roleId: formData.roleId,
            password: formData.password, // Include password in payload when creating new user
        };

        try {
            if (user && user.user_id) {
                // Update existing user
                await axios.put(`${process.env.REACT_APP_API_URL}/users/${user.user_id}`, payload, {
                    headers: {
                        role: role,
                        'user-id': userId,
                    },
                });
            } else {
                // Create new user via admin endpoint
                await axios.post(`${process.env.REACT_APP_API_URL}/users`, payload, {
                    headers: {
                        role: role,
                        'user-id': userId,
                    },
                });
            }
            onClose(); // Close the modal upon successful submission
        } catch (error) {
            console.error('Error submitting form:', error);
            // Display error message from server or a generic message
            setError(
                error.response?.data?.message || 'An error occurred while submitting the form.'
            );
        }
    };

    // Open the Change Password Modal
    const openPasswordModal = () => {
        setIsPasswordModalOpen(true);
    };

    // Close the Change Password Modal
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
                    {error && <div className={styles.error}>{error}</div>}
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
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
                    {role === 'admin' && (
                        <label>
                            Role:
                            <select
                                name="roleId"
                                value={formData.roleId}
                                onChange={handleChange}
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Staff</option>
                                <option value={3}>Customer</option>
                                <option value={4}>Member</option>
                            </select>
                        </label>
                    )}
                    {/* Only show password fields when creating a new user */}
                    {(!user || !user.user_id) && (
                        <>
                            <label>
                                Password:
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                Confirm Password:
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </>
                    )}
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

            {/* Change Password Modal */}
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
