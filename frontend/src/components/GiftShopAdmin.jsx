import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GiftShopFormModal from '../components/GiftShopForm';
import styles from '../css/GiftShopAdmin.module.css';
import HomeNavBar from "./HomeNavBar";
import config from '../config';

const GiftShopAdmin = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToRestore, setItemToRestore] = useState(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get(`${config.backendUrl}/giftshopitemsall`)
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    };

    const getImageUrl = (itemId) => {
        return `${config.backendUrl}/giftshopitems/${itemId}/image`;
    };

    // Confirm Soft or Hard Delete
    const confirmDelete = (id) => {
        setItemToDelete(id);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setItemToDelete(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = (isHardDelete) => {
        if (itemToDelete) {
            isHardDelete ? handleHardDelete(itemToDelete) : handleSoftDelete(itemToDelete);
        }
        cancelDelete();
    };

    const handleSoftDelete = (id) => {
        const role = localStorage.getItem('role');
        axios.put(`${config.backendUrl}/giftshopitems/${id}/soft-delete`, {}, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error soft deleting item:', error));
    };

    const handleHardDelete = (id) => {
        const role = localStorage.getItem('role');
        axios.delete(`${config.backendUrl}/giftshopitems/${id}/hard-delete`, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error hard deleting item:', error));
    };

    // Confirm Restore
    const confirmRestore = (id) => {
        setItemToRestore(id);
        setShowRestoreModal(true);
    };

    const cancelRestore = () => {
        setItemToRestore(null);
        setShowRestoreModal(false);
    };

    const handleRestore = (id) => {
        const role = localStorage.getItem('role');
        axios.put(`${config.backendUrl}/giftshopitems/${id}/restore`, {}, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error restoring item:', error));
        cancelRestore();
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
            <HomeNavBar />
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
                {Array.isArray(items) && items.map(item => (
                    <tr key={item.item_id}>
                        <td>{item.name_}</td>
                        <td>{item.category}</td>
                        <td>${parseFloat(item.price).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>{Number(item.is_deleted) === 1 ? 'Deleted' : 'Active'}</td>
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
                                <>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => confirmDelete(item.item_id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button
                                    className={styles.actionButton}
                                    onClick={() => confirmRestore(item.item_id)}
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
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <span className={styles.close_button} onClick={cancelDelete}>&times;</span>
                        <h2>Confirm Deletion</h2>
                        <p>Do you want to soft delete or permanently delete this item?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={() => handleConfirmDelete(false)}>
                                Soft Delete
                            </button>
                            <button className={styles.formButton} onClick={() => handleConfirmDelete(true)}>
                                Hard Delete
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
                        <p>Are you sure you want to restore this item?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={() => handleRestore(itemToRestore)}>Yes, Restore</button>
                            <button className={styles.formButton} onClick={cancelRestore}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftShopAdmin;
