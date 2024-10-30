// src/components/GiftShopFormModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/GiftShopForm.module.css';

const GiftShopFormModal = ({ item = {}, onClose }) => {
    const [formData, setFormData] = useState({
        name_: '',
        category: '',
        price: '',
        quantity: '',
        image: null
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        if (item) {
            setFormData({
                name_: item.name_ || '',
                category: item.category || '',
                price: item.price || '',
                quantity: item.quantity || '',
                image: null
            });
        }
    }, [item]);

    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setItemToDelete(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            handleDelete(itemToDelete);
        }
        cancelDelete();
    };

    const handleDelete = (id) => {
        const role = localStorage.getItem('role');
        axios.put(`http://${process.env.REACT_APP_API_URL}/giftshopitems/${id}/soft-delete`, {}, {
            headers: { role }
        })
            .then(() => onClose())
            .catch(error => console.error('Error soft deleting item:', error));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name_', formData.name_);
        data.append('category', formData.category);
        data.append('price', parseFloat(formData.price)); // Convert to float
        data.append('quantity', formData.quantity);
        if (formData.image) {
            data.append('image', formData.image);
        }

        const role = localStorage.getItem('role');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                role
            }
        };

        if (item && item.item_id) {
            axios.put(`http://${process.env.REACT_APP_API_URL}/giftshopitems/${item.item_id}`, data, config)
                .then(() => onClose())
                .catch(error => console.error('Error updating item:', error));
        } else {
            axios.post('http://${process.env.REACT_APP_API_URL}/giftshopitems', data, config)
                .then(() => onClose())
                .catch(error => console.error('Error creating item:', error));
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <span className={styles.close_button} onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <h2>{item && item.item_id ? 'Edit Item' : 'Add New Item'}</h2>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name_"
                            value={formData.name_}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Category:
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Image:
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </label>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.formButton}>
                            {item && item.item_id ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className={styles.formButton} onClick={onClose}>
                            Cancel
                        </button>
                        {item && item.item_id && (
                            <button
                                type="button"
                                className={styles.formButton}
                                onClick={() => confirmDelete(item.item_id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </form>
                {showDeleteModal && (
                    <div className={styles.modal}>
                        <div className={styles.modal_content}>
                            <span className={styles.close_button} onClick={cancelDelete}>&times;</span>
                            <h2>Confirm Deletion</h2>
                            <p>Are you sure you want to delete this item?</p>
                            <div className={styles.buttonGroup}>
                                <button className={styles.formButton} onClick={handleConfirmDelete}>Yes, Delete</button>
                                <button className={styles.formButton} onClick={cancelDelete}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GiftShopFormModal;
