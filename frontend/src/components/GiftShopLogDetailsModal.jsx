// src/components/GiftShopLogDetailsModal.jsx

import React from 'react';
import styles from '../css/GiftShopLogDetailsModal.module.css';

/**
 * Modal component to display detailed information about a specific log entry.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.log - The log entry to display.
 * @param {Function} props.onClose - Function to close the modal.
 * @returns {JSX.Element} - The rendered modal component.
 */
const GiftShopLogDetailsModal = ({ log, onClose }) => {
    // Parse JSON strings to objects
    const oldValues = log.old_values ? JSON.parse(log.old_values) : {};
    const newValues = log.new_values ? JSON.parse(log.new_values) : {};

    /**
     * Compares old and new values and returns an array of changed fields.
     * Each element includes the field name, old value, new value, and a flag indicating if it's an image.
     *
     * @param {Object} oldVals - Original values before the change.
     * @param {Object} newVals - Updated values after the change.
     * @returns {Array} - Array of changed fields.
     */
    const getChangedFields = (oldVals, newVals) => {
        const changedFields = [];

        for (const key in newVals) {
            if (newVals.hasOwnProperty(key)) {
                // Special handling for image fields
                if (key.toLowerCase().includes('image')) {
                    if (oldVals[key] !== newVals[key]) {
                        changedFields.push({
                            field: key,
                            oldValue: oldVals[key],
                            newValue: newVals[key],
                            isImage: true,
                        });
                    }
                } else {
                    if (oldVals[key] !== newVals[key]) {
                        changedFields.push({
                            field: key,
                            oldValue: oldVals[key],
                            newValue: newVals[key],
                            isImage: false,
                        });
                    }
                }
            }
        }

        return changedFields;
    };

    // Determine changed fields
    const changedFields = getChangedFields(oldValues, newValues);

    /**
     * Formats the field name to be more user-friendly.
     * E.g., "name_" becomes "Name"
     *
     * @param {string} fieldName - The original field name.
     * @returns {string} - The formatted field name.
     */
    const formatFieldName = (fieldName) => {
        // Replace underscores with spaces and capitalize each word
        return fieldName
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <span className={styles.closeButton} onClick={onClose}>&times;</span>
                <h2>Log Details</h2>
                <div className={styles.detailsSection}>
                    <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                    <p><strong>Action:</strong> {log.action}</p>
                    <p><strong>Item ID:</strong> {log.item_id}</p>
                    <p><strong>User:</strong> {log.username || 'customer'}</p>
                    <p><strong>Role:</strong> {log.role || 'customer'}</p>

                    {changedFields.length > 0 ? (
                        <div className={styles.changedFields}>
                            <h3>Changed Fields:</h3>
                            <ul>
                                {changedFields.map((field, index) => (
                                    <li key={index} className={styles.fieldItem}>
                                        <strong>{formatFieldName(field.field)}:</strong>
                                        {field.isImage ? (
                                            <div className={styles.imageChanges}>
                                                {field.oldValue && (
                                                    <div className={styles.imageContainer}>
                                                        <p>Old Image:</p>
                                                        <img src={field.oldValue} alt={`Old ${formatFieldName(field.field)}`} className={styles.logImage} />
                                                    </div>
                                                )}
                                                {field.newValue && (
                                                    <div className={styles.imageContainer}>
                                                        <p>New Image:</p>
                                                        <img src={field.newValue} alt={`New ${formatFieldName(field.field)}`} className={styles.logImage} />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className={styles.valueChange}>
                                                <span className={styles.oldValue}> {field.oldValue} </span>
                                                <span className={styles.arrow}>→</span>
                                                <span className={styles.newValue}> {field.newValue} </span>
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No changes recorded.</p>
                    )}
                </div>
                <button className={styles.closeButtonMain} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default GiftShopLogDetailsModal;
