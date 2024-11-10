import React, { useState, useEffect } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import ArtImage from '../assets/art.png';
import styles from '../css/Art.module.css';
import ArtLookUp from '../components/ArtLookUp';

const Art = () => {
    return (
        <div>
            <div className={styles.ArtContainer}>
                <HomeNavBar />
                <div className={styles.ImageContainer}>
                    <img src={ArtImage} alt="Art" className={styles.HalfBackgroundImage} />
                    <div className={styles.overlay}>
                        <h1 className={styles.title}>Artwork</h1>
                    </div>
                </div>

                <ArtLookUp />

            </div>
        </div>
    );
};

export default Art;
