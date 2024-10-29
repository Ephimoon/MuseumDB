// src/pages/GiftShopAdmin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GiftShopFormModal from '../components/GiftShopForm';
import styles from '../css/GiftShopAdmin.module.css';

const GiftShopAdmin = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get('http://localhost:5000/giftshopitemsall')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    };

    const getImageUrl = (itemId) => {
        return `http://localhost:5000/giftshopitems/${itemId}/image`;
    };

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
        axios.put(`http://localhost:5000/giftshopitems/${id}/soft-delete`, {}, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error soft deleting item:', error));
    };

    const handleRestore = (id) => {
        const role = localStorage.getItem('role');
        axios.put(`http://localhost:5000/giftshopitems/${id}/restore`, {}, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error restoring item:', error));
    };

    const openFormModal = (item = null) => {
        setSelectedItem(item);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedItem(null);
        fetchItems();
    };

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.title}>Gift Shop Admin</h1>
            <button className={styles.addButton} onClick={() => openFormModal()}>
                Add New Item
            </button>
            <table className={styles.itemTable}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {items.map(item => (
                    <tr key={item.item_id}>
                        <td>{item.name_}</td>
                        <td>{item.category}</td>
                        <td>${parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>{Number(item.is_deleted) === 1 ? 'Deleted' : 'Active'}</td> {/* Corrected line */}
                        <td>
                            <img
                                src={getImageUrl(item.item_id)}
                                alt={item.name_}
                                className={styles.itemImage}
                            />
                        </td>
                        <td>
                            <button className={styles.actionButton} onClick={() => openFormModal(item)}>Edit</button>
                            {Number(item.is_deleted) === 0 ? (
                                <button
                                    className={styles.actionButton}
                                    onClick={() => confirmDelete(item.item_id)}
                                >
                                    Delete
                                </button>
                            ) : (
                                <button
                                    className={styles.actionButton}
                                    onClick={() => handleRestore(item.item_id)}
                                >
                                    Restore
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isFormModalOpen && (
                <GiftShopFormModal
                    item={selectedItem}
                    onClose={closeFormModal}
                />
            )}
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
    );
};

export default GiftShopAdmin;
