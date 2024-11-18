// src/components/AnnouncementFormModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/AnnouncementFormModal.module.css';

const AnnouncementFormModal = ({ announcement = {}, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'low',
    });
    const [message, setMessage] = useState('');

    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (announcement && announcement.id) {
            setFormData({
                title: announcement.title || '',
                content: announcement.content || '',
                target_audience: announcement.target_audience || 'all',
                priority: announcement.priority || 'low',
            });
        } else {
            setFormData({
                title: '',
                content: '',
                target_audience: 'all',
                priority: 'low',
            });
        }
    }, [announcement]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const config = {
            headers: { 'user-id': userId, role },
        };

        if (announcement && announcement.id) {
            axios
                .put(`${process.env.REACT_APP_API_URL}/announcements/${announcement.id}`, formData, config)
                .then(() => onClose())
                .catch((error) => console.error('Error updating announcement:', error));
        } else {
            axios
                .post(`${process.env.REACT_APP_API_URL}/announcements`, formData, config)
                .then(() => onClose())
                .catch((error) => console.error('Error creating announcement:', error));
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <span className={styles.close_button} onClick={onClose}>
                    &times;
                </span>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <h2>{announcement && announcement.id ? 'Edit Announcement' : 'Add New Announcement'}</h2>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Content:
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Target Audience:
                        <select
                            name="target_audience"
                            value={formData.target_audience}
                            onChange={handleChange}
                            required
                        >
                            <option value="all">All</option>
                            <option value="staff">Staff</option>
                            <option value="member">Member</option>
                            <option value="customer">Customer</option>
                        </select>
                    </label>
                    <label>
                        Priority:
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            required
                        >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </label>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.formButton}>
                            {announcement && announcement.id ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className={styles.formButton} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </div>
    );
};

export default AnnouncementFormModal;
