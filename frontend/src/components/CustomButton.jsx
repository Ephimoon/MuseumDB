import React from 'react';
import styles from '../css/Auth.module.css';

const CustomButton = ({ children, onClick }) => (
    <button className={styles.button} onClick={onClick}>
        {children}
    </button>
);

export default CustomButton;
