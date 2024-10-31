// src/components/MFAShopCard.jsx
import React from 'react';
import styles from '../css/MFAShop.module.css';

const MFAShopCard = ({ items, onCardClick }) => {
    const getImageUrl = (itemId) => {
        return `${process.env.REACT_APP_API_URL}/giftshopitems/${itemId}/image`;
    };

    return (
        <div className={styles.cards}>
            {items.map((item) => (
                <div key={item.item_id} className={styles.card} onClick={() => onCardClick(item)}>
                    <img src={getImageUrl(item.item_id)} alt={item.name_} className={styles.image} />
                    <h1>{item.name_}</h1>
                    <p>
                        ${parseFloat(item.price).toFixed(2)}
                    </p>
                    <button className={styles.button}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

export default MFAShopCard;
