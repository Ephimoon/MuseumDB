// src/pages/GiftShopAdmin.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GiftShopFormModal from '../components/GiftShopForm';
import styles from '../css/GiftShopAdmin.module.css';
import HomeNavBar from './HomeNavBar';

const GiftShopAdmin = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToRestore, setItemToRestore] = useState(null);

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust the number of items per page as needed

    // Filter state variables
    const [filterName, setFilterName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [items, filterName, filterCategory, filterPriceMin, filterPriceMax, filterQuantity, filterStatus]);

    const fetchItems = () => {
        axios.get(`http://localhost:5000/giftshopitemsall`)
            .then(response => setItems(response.data))
            .catch(error => console.error('Error fetching items:', error));
    };

    const getImageUrl = (itemId) => {
        return `http://localhost:5000/giftshopitems/${itemId}/image`;
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
        axios.put(`http://localhost:5000/giftshopitems/${id}/soft-delete`, {}, {
            headers: { role }
        })
            .then(() => fetchItems())
            .catch(error => console.error('Error soft deleting item:', error));
    };

    const handleHardDelete = (id) => {
        const role = localStorage.getItem('role');
        axios.delete(`http://localhost:5000/giftshopitems/${id}/hard-delete`, {
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
        axios.put(`http://localhost:5000/giftshopitems/${id}/restore`, {}, {
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

    // Filter items based on filter criteria
    const filteredItems = items.filter(item => {
        const matchesName = item.name_.toLowerCase().includes(filterName.toLowerCase());
        const matchesCategory = filterCategory ? item.category === filterCategory : true;
        const matchesPriceMin = filterPriceMin ? parseFloat(item.price) >= parseFloat(filterPriceMin) : true;
        const matchesPriceMax = filterPriceMax ? parseFloat(item.price) <= parseFloat(filterPriceMax) : true;
        const matchesQuantity = filterQuantity ? item.quantity === parseInt(filterQuantity) : true;
        const matchesStatus = filterStatus ? (filterStatus === 'Active' ? item.is_deleted === 0 : item.is_deleted === 1) : true;
        return matchesName && matchesCategory && matchesPriceMin && matchesPriceMax && matchesQuantity && matchesStatus;
    });

    // Calculate total pages and current items
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Extract unique categories for filter dropdown
    const uniqueCategories = [...new Set(items.map(item => item.category))];

    return (
        <div className={styles.adminContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Gift Shop Admin</h1>
            <button className={styles.addButton} onClick={() => openFormModal()}>
                Add New Item
            </button>

            {/* Filter Section */}
            <div className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterName">Name:</label>
                    <input
                        type="text"
                        id="filterName"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        placeholder="Search by name"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterCategory">Category:</label>
                    <select
                        id="filterCategory"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        {uniqueCategories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterPriceMin">Price Min:</label>
                    <input
                        type="number"
                        id="filterPriceMin"
                        value={filterPriceMin}
                        onChange={(e) => setFilterPriceMin(e.target.value)}
                        placeholder="Min price"
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterPriceMax">Price Max:</label>
                    <input
                        type="number"
                        id="filterPriceMax"
                        value={filterPriceMax}
                        onChange={(e) => setFilterPriceMax(e.target.value)}
                        placeholder="Max price"
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="filterQuantity">Quantity:</label>
                    <input
                        type="number"
                        id="filterQuantity"
                        value={filterQuantity}
                        onChange={(e) => setFilterQuantity(e.target.value)}
                        placeholder="Exact quantity"
                        min="0"
                    />
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
                <button className={styles.clearButton} onClick={() => {
                    setFilterName('');
                    setFilterCategory('');
                    setFilterPriceMin('');
                    setFilterPriceMax('');
                    setFilterQuantity('');
                    setFilterStatus('');
                }}>
                    Clear Filters
                </button>
            </div>

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
                {Array.isArray(currentItems) && currentItems.map(item => (
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
                            <button className={styles.formButton} onClick={() => handleRestore(itemToRestore)}>
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

export default GiftShopAdmin;
