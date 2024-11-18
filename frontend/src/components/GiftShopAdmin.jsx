// src/pages/GiftShopAdmin.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GiftShopFormModal from '../components/GiftShopForm';
import GiftShopLogDetailsModal from '../components/GiftShopLogDetailsModal';
import styles from '../css/GiftShopAdmin.module.css';
import HomeNavBar from './HomeNavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GiftShopAdmin = () => {
    const [items, setItems] = useState([]);
    const [logs, setLogs] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemToRestore, setItemToRestore] = useState(null);
    const [isLogView, setIsLogView] = useState(false); // State to toggle between Manage and Logs
    const [showLogDetailsModal, setShowLogDetailsModal] = useState(false);
    const [selectedLogDetails, setSelectedLogDetails] = useState(null);

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Adjust the number of items per page as needed

    // Filter state variables for items
    const [filterName, setFilterName] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPriceMin, setFilterPriceMin] = useState('');
    const [filterPriceMax, setFilterPriceMax] = useState('');
    const [filterQuantity, setFilterQuantity] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false); // New state for Low Stock Filter

    // Filter state variables for logs
    const [filterLogAction, setFilterLogAction] = useState('');
    const [filterLogItemName, setFilterLogItemName] = useState('');
    const [filterLogUser, setFilterLogUser] = useState('');
    const [filterLogRole, setFilterLogRole] = useState('');
    const [filterLogDateFrom, setFilterLogDateFrom] = useState('');
    const [filterLogDateTo, setFilterLogDateTo] = useState('');

    useEffect(() => {
        if (isLogView) {
            fetchLogs();
        } else {
            fetchItems();
        }
    }, [isLogView]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        items,
        logs,
        filterName,
        filterCategory,
        filterPriceMin,
        filterPriceMax,
        filterQuantity,
        filterStatus,
        filterLowStock,
        filterLogAction,
        filterLogItemName,
        filterLogUser,
        filterLogRole,
        filterLogDateFrom,
        filterLogDateTo,
    ]);

    // Fetch gift shop items (including deleted for admin view)
    const fetchItems = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/giftshopitemsall`)
            .then((response) => {
                setItems(response.data);
                toast.success('Items fetched successfully!');
            })
            .catch((error) => {
                console.error('Error fetching items:', error);
                toast.error('Failed to fetch items.');
            });
    };

    // Fetch logs
    const fetchLogs = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/giftshopitems/logs`, {
                headers: {
                    'user-id': localStorage.getItem('userId'),
                    role: localStorage.getItem('role'),
                },
            })
            .then((response) => {
                setLogs(response.data);
                toast.success('Logs fetched successfully!');
            })
            .catch((error) => {
                console.error('Error fetching logs:', error);
                toast.error('Failed to fetch logs.');
            });
    };

    const getImageUrl = (itemId) => {
        return `${process.env.REACT_APP_API_URL}/giftshopitems/${itemId}/image`;
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
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/giftshopitems/${id}/soft-delete`,
                {},
                {
                    headers: { role: role, 'user-id': localStorage.getItem('userId') },
                }
            )
            .then(() => {
                fetchItems();
                toast.success('Item soft deleted successfully!');
            })
            .catch((error) => {
                console.error('Error soft deleting item:', error);
                toast.error('Failed to soft delete the item.');
            });
    };

    const handleHardDelete = (id) => {
        const role = localStorage.getItem('role');
        axios
            .delete(`${process.env.REACT_APP_API_URL}/giftshopitems/${id}/hard-delete`, {
                headers: { role: role, 'user-id': localStorage.getItem('userId') },
            })
            .then(() => {
                fetchItems();
                toast.success('Item hard deleted successfully!');
            })
            .catch((error) => {
                console.error('Error hard deleting item:', error);
                toast.error('Failed to hard delete the item.');
            });
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
        axios
            .put(
                `${process.env.REACT_APP_API_URL}/giftshopitems/${id}/restore`,
                {},
                {
                    headers: { role: role, 'user-id': localStorage.getItem('userId') },
                }
            )
            .then(() => {
                fetchItems();
                toast.success('Item restored successfully!');
            })
            .catch((error) => {
                console.error('Error restoring item:', error);
                toast.error('Failed to restore the item.');
            });
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

    // Open Log Details Modal
    const openLogDetailsModal = (log) => {
        setSelectedLogDetails(log);
        setShowLogDetailsModal(true);
    };

    const closeLogDetailsModal = () => {
        setSelectedLogDetails(null);
        setShowLogDetailsModal(false);
    };

    // Filter items based on filter criteria
    const filteredItems = items.filter((item) => {
        const matchesName = item.name_.toLowerCase().includes(filterName.toLowerCase());
        const matchesCategory = filterCategory ? item.category === filterCategory : true;
        const matchesPriceMin = filterPriceMin ? parseFloat(item.price) >= parseFloat(filterPriceMin) : true;
        const matchesPriceMax = filterPriceMax ? parseFloat(item.price) <= parseFloat(filterPriceMax) : true;
        const matchesQuantity = filterQuantity ? item.quantity === parseInt(filterQuantity) : true;
        const matchesStatus = filterStatus
            ? filterStatus === 'Active'
                ? item.is_deleted === 0
                : item.is_deleted === 1
            : true;
        const matchesLowStock = filterLowStock ? item.quantity < 10 : true;
        return (
            matchesName &&
            matchesCategory &&
            matchesPriceMin &&
            matchesPriceMax &&
            matchesQuantity &&
            matchesStatus &&
            matchesLowStock
        );
    });

    // Filter logs based on filter criteria
    const filteredLogs = logs.filter((log) => {
        const matchesAction = filterLogAction
            ? log.action.toLowerCase().includes(filterLogAction.toLowerCase())
            : true;
        const matchesItemName = filterLogItemName
            ? (log.item_name || '').toLowerCase().includes(filterLogItemName.toLowerCase())
            : true;
        const matchesUser = filterLogUser
            ? (log.username || '').toLowerCase().includes(filterLogUser.toLowerCase())
            : true;
        const matchesRole = filterLogRole
            ? (log.role || '').toLowerCase().includes(filterLogRole.toLowerCase())
            : true;
        const logDate = new Date(log.timestamp);
        const matchesDateFrom = filterLogDateFrom ? logDate >= new Date(filterLogDateFrom) : true;
        const matchesDateTo = filterLogDateTo ? logDate <= new Date(filterLogDateTo) : true;

        return (
            matchesAction &&
            matchesItemName &&
            matchesUser &&
            matchesRole &&
            matchesDateFrom &&
            matchesDateTo
        );
    });

    // Calculate total pages and current items
    const totalPages = isLogView
        ? Math.ceil(filteredLogs.length / itemsPerPage)
        : Math.ceil(filteredItems.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItemsToDisplay = isLogView
        ? filteredLogs.slice(indexOfFirstItem, indexOfLastItem)
        : filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    // Extract unique categories for filter dropdown
    const uniqueCategories = [...new Set(items.map((item) => item.category))];

    // Functions to switch views and reset filters
    const switchToLogView = () => {
        setIsLogView(true);
        // Clear log filters
        setFilterLogAction('');
        setFilterLogItemName('');
        setFilterLogUser('');
        setFilterLogRole('');
        setFilterLogDateFrom('');
        setFilterLogDateTo('');
        toast.info('Switched to Logs view.');
    };

    const switchToManageItemsView = () => {
        setIsLogView(false);
        // Clear item filters
        setFilterName('');
        setFilterCategory('');
        setFilterPriceMin('');
        setFilterPriceMax('');
        setFilterQuantity('');
        setFilterStatus('');
        setFilterLowStock(false);
        toast.info('Switched to Manage Items view.');
    };

    const clearItemFilters = () => {
        setFilterName('');
        setFilterCategory('');
        setFilterPriceMin('');
        setFilterPriceMax('');
        setFilterQuantity('');
        setFilterStatus('');
        setFilterLowStock(false);
        toast.info('Item filters cleared.');
    };

    const clearLogFilters = () => {
        setFilterLogAction('');
        setFilterLogItemName('');
        setFilterLogUser('');
        setFilterLogRole('');
        setFilterLogDateFrom('');
        setFilterLogDateTo('');
        toast.info('Log filters cleared.');
    };

    return (
        <div className={styles.adminContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Gift Shop Admin</h1>

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
                {!isLogView && (
                    <button className={`${styles.button} ${styles.addButton}`} onClick={() => openFormModal()}>
                        Add New Item
                    </button>
                )}
                {!isLogView && (
                    <button
                        className={`${styles.button} ${styles.viewLogsButton}`}
                        onClick={switchToLogView}
                    >
                        View Logs
                    </button>
                )}

                {isLogView && (
                    <button
                        className={`${styles.button} ${styles.backButton}`}
                        onClick={switchToManageItemsView}
                    >
                        Back to Manage Items
                    </button>
                )}
            </div>

            {/* Filter Section */}
            {!isLogView && (
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
                                <option key={index} value={category}>
                                    {category}
                                </option>
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
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLowStock">Low Stock</label>
                        <input
                            type="checkbox"
                            id="filterLowStock"
                            checked={filterLowStock}
                            onChange={(e) => setFilterLowStock(e.target.checked)}
                        />
                    </div>
                    <button
                        className={styles.clearButton}
                        onClick={clearItemFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Filter Section for Logs */}
            {isLogView && (
                <div className={styles.filterSection}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLogAction">Action:</label>
                        <input
                            type="text"
                            id="filterLogAction"
                            value={filterLogAction}
                            onChange={(e) => setFilterLogAction(e.target.value)}
                            placeholder="Search by action"
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLogItemName">Item Name:</label>
                        <input
                            type="text"
                            id="filterLogItemName"
                            value={filterLogItemName}
                            onChange={(e) => setFilterLogItemName(e.target.value)}
                            placeholder="Search by item name"
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLogUser">User:</label>
                        <input
                            type="text"
                            id="filterLogUser"
                            value={filterLogUser}
                            onChange={(e) => setFilterLogUser(e.target.value)}
                            placeholder="Search by user"
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLogRole">Role:</label>
                        <input
                            type="text"
                            id="filterLogRole"
                            value={filterLogRole}
                            onChange={(e) => setFilterLogRole(e.target.value)}
                            placeholder="Search by role"
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLogDateFrom">Date From:</label>
                        <input
                            type="date"
                            id="filterLogDateFrom"
                            value={filterLogDateFrom}
                            onChange={(e) => setFilterLogDateFrom(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="filterLogDateTo">Date To:</label>
                        <input
                            type="date"
                            id="filterLogDateTo"
                            value={filterLogDateTo}
                            onChange={(e) => setFilterLogDateTo(e.target.value)}
                        />
                    </div>
                    <button
                        className={styles.clearButton}
                        onClick={clearLogFilters}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Manage Items View */}
            {!isLogView && (
                <>
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
                        {Array.isArray(currentItemsToDisplay) &&
                            currentItemsToDisplay.map((item) => (
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
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => openFormModal(item)}
                                        >
                                            Edit
                                        </button>
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
                                className={`${styles.pageButton} ${
                                    currentPage === index + 1 ? styles.activePage : ''
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Logs View */}
            {isLogView && (
                <>
                    <table className={styles.itemTable}>
                        <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Item ID</th>
                            <th>Item Name</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Details</th>
                        </tr>
                        </thead>

                        <tbody>
                        {Array.isArray(currentItemsToDisplay) &&
                            currentItemsToDisplay.map((log) => (
                                <tr key={log.log_id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.action}</td>
                                    <td>{log.item_id}</td>
                                    <td>{log.item_name || 'N/A'}</td>
                                    <td>{log.username || 'Unknown'}</td>
                                    <td>{log.role}</td>
                                    <td>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => openLogDetailsModal(log)}
                                        >
                                            View Details
                                        </button>
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
                                className={`${styles.pageButton} ${
                                    currentPage === index + 1 ? styles.activePage : ''
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Add/Edit Item Modal */}
            {isFormModalOpen && <GiftShopFormModal item={selectedItem} onClose={closeFormModal} />}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <span className={styles.close_button} onClick={cancelDelete}>
                            &times;
                        </span>
                        <h2>Confirm Deletion</h2>
                        <p>Do you want to soft delete or permanently delete this item?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={() => handleConfirmDelete(false)}>
                                Soft Delete
                            </button>
                            <button className={styles.formButton} onClick={() => handleConfirmDelete(true)}>
                                Hard Delete
                            </button>
                            <button className={styles.formButton} onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Confirmation Modal */}
            {showRestoreModal && (
                <div className={styles.modal}>
                    <div className={styles.modal_content}>
                        <span className={styles.close_button} onClick={cancelRestore}>
                            &times;
                        </span>
                        <h2>Confirm Restore</h2>
                        <p>Are you sure you want to restore this item?</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.formButton} onClick={() => handleRestore(itemToRestore)}>
                                Yes, Restore
                            </button>
                            <button className={styles.formButton} onClick={cancelRestore}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Details Modal */}
            {showLogDetailsModal && selectedLogDetails && (
                <GiftShopLogDetailsModal log={selectedLogDetails} onClose={closeLogDetailsModal} />
            )}
        </div>
    );

};

export default GiftShopAdmin;
