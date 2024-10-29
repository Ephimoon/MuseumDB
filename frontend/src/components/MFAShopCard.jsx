import React from 'react';
import styles from '../css/MFAShop.module.css';

const MFAShopCard = ({ items, onCardClick }) => {
    return (
        <div className={styles.cards}>
            {items.map((item) => (
                <div key={item.id} className={styles.card} onClick={() => onCardClick(item)}>
                    <img src={item.image} alt={item.name} className={styles.image} />
                    <h1>{item.name}</h1>
                    <p>{item.price}</p>
                    <button className={styles.button}>Add to Cart</button>
                </div>
            ))}
        </div>
    );
};

const MFAShopModalUser = ({ item, onClose }) => {
    return (
        <div className={styles.modal}>
            <div className={styles.modal_content}>
                <span className={styles.close_button} onClick={onClose}>&times;</span>
                <img src={item.image} alt={item.name} className={styles.modal_image} />
                <h2>{item.name}</h2>
                <p><strong>Price:</strong> {item.price}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <button className={styles.button}>Add to Cart</button>
            </div>
        </div>
    );
};

export { MFAShopCard, MFAShopModalUser };
