// src/pages/GiftShopAdmin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GiftShopFormModal from '../components/GiftShopForm';
import styles from '../css/GiftShopAdmin.module.css';

const GiftShopAdmin = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get('http://localhost:5000/giftshopitems')
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    };

    const getImageUrl = (itemId) => {
        return `http://localhost:5000/giftshopitems/${itemId}/image`;
    };

    const handleDelete = (id) => {
        const role = localStorage.getItem('role');
        axios.delete(`http://localhost:5000/giftshopitems/${id}`, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error deleting item:', error));
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
                        <td>
                            <img
                                src={getImageUrl(item.item_id)}
                                alt={item.name_}
                                className={styles.itemImage}
                            />
                        </td>
                        <td>
                            <button className={styles.actionButton} onClick={() => openFormModal(item)}>Edit</button>
                            <button className={styles.actionButton} onClick={() => handleDelete(item.item_id)}>Delete</button>
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
        </div>
    );
};

export default GiftShopAdmin;
