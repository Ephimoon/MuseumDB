// src/components/GiftShopFormModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/GiftShopForm.module.css';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Import the Image Preview plugin
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

// Register the plugin
registerPlugin(FilePondPluginImagePreview);

const GiftShopFormModal = ({ item = {}, onClose }) => {
    const [formData, setFormData] = useState({
        name_: '',
        category: '',
        price: '',
        quantity: '',
    });
    const [imageFile, setImageFile] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (item && item.item_id) {
            // Set form data
            setFormData({
                name_: item.name_ || '',
                category: item.category || '',
                price: item.price || '',
                quantity: item.quantity || '',
            });

            // Set the image file using the URL
            setImageFile([
                {
                    source: `http://localhost:5000/giftshopitems/${item.item_id}/image`,
                    options: {
                        type: 'remote', // Indicate that the source is a remote URL
                    },
                },
            ]);
        } else {
            // Reset form data
            setFormData({
                name_: '',
                category: '',
                price: '',
                quantity: '',
            });
            setImageFile([]);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('name_', formData.name_);
        data.append('category', formData.category);
        data.append('price', parseFloat(formData.price)); // Convert to float
        data.append('quantity', formData.quantity);

        if (imageFile.length > 0 && imageFile[0].file instanceof File) {
            data.append('image', imageFile[0].file);
        }

        const role = localStorage.getItem('role');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data', // or 'application/json' as appropriate
                'user-id': localStorage.getItem('userId'),
                'role': localStorage.getItem('role'),
            },
        };


        if (item && item.item_id) {
            axios
                .put(`http://localhost:5000/giftshopitems/${item.item_id}`, data, config)
                .then(() => onClose())
                .catch((error) => console.error('Error updating item:', error));
        } else {
            axios
                .post(`http://localhost:5000/giftshopitems`, data, config)
                .then(() => onClose())
                .catch((error) => console.error('Error creating item:', error));
        }
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <span className={styles.close_button} onClick={onClose}>
                    &times;
                </span>
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
                        <FilePond
                            files={imageFile}
                            onupdatefiles={setImageFile}
                            allowMultiple={false}
                            acceptedFileTypes={['image/*']}
                            labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                        />
                    </label>
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={styles.formButton}>
                            {item && item.item_id ? 'Update' : 'Create'}
                        </button>
                        <button type="button" className={styles.formButton} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GiftShopFormModal;
