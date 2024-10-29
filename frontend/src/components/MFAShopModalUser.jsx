// src/components/MFAShopModalUser.jsx
import React from 'react';
import styles from '../css/MFAShop.module.css';

const MFAShopModalUser = ({ item, onClose }) => {
    const getImageUrl = (itemId) => {
        return `http://localhost:5000/giftshopitems/${itemId}/image`;
    };

    // Ensure price is a number before formatting
    const formattedPrice = item.price ? `$${parseFloat(item.price).toFixed(2)}` : 'N/A';

    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <span className={styles.close_button} onClick={onClose}>&times;</span>
                <img
                    src={getImageUrl(item.item_id)}
                    alt={item.name_}
                    className={styles.modal_image}
                />
                <h2>{item.name_}</h2>
                <p><strong>Price:</strong> {formattedPrice}</p>
                <p><strong>Category:</strong> {item.category || 'N/A'}</p>
                <p><strong>Description:</strong> {item.description || 'No description available.'}</p>
                <button className={styles.button}>Add to Cart</button>
            </div>
        </div>
    );
};

export default MFAShopModalUser;
