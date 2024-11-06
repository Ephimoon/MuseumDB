import React, { useState, useEffect } from 'react';
import { ArtworkCard, ArtworkModalUser, ArtistCard, ArtistModalUser } from '../components/ArtworkCard';
import styles from '../css/Art.module.css';
import axios from 'axios';
import config from '../config';

const ArtLookUp = ({ refreshArtists, onRefresh }) => {
    // -- fetch artwork and artist data from backend -------------------------------------------------------------
    const [artworks, setArtworks] = useState([]); // store artworks data to fetch and display
    const [artists, setArtists] = useState([]); // store artists data to fetch and display
    useEffect(() => {
        fetchArtwork();
    }, []);
    useEffect(() => {
        fetchArtist();
    }, [refreshArtists]);
    const fetchArtwork = () => {
        axios.get(`${config.backendUrl}/artwork`)
            .then(response => setArtworks(response.data))
            .catch(err => console.log('Error fetching artwork:', err));
    };
    const fetchArtist = () => {
        axios.get(`${config.backendUrl}/artist`)
            .then((response) => setArtists(response.data))
            .catch(err => console.log('Error fetching artists:', err));
    };

    // -- handle tab switch between artwork and artist -----------------------------------------------------------
    const [activeTab, setActiveTab] = useState('artwork');
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
    };

    // -- open modal to show more details about the selected artwork/artist ---------------------------------------------
    const [selectedArtwork, setSelectedArtwork] = useState(null); // Track selected artwork
    const [selectedArtist, setSelectedArtist] = useState(null); // Track selected artwork
    const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
    const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
    const openArtworkModal = (artwork) => {
        setSelectedArtwork(artwork);
        setIsArtworkModalOpen(true);
    };
    const closeArtworkModal = () => {
        setSelectedArtwork(null);
        setIsArtworkModalOpen(false);
    };
    const openArtistModal = (artist) => {
        setSelectedArtist(artist);
        setIsArtistModalOpen(true);
    };
    const closeArtistModal = () => {
        setSelectedArtist(null);
        setIsArtistModalOpen(false);
    };

    return (
        <div>
            <div className={styles.FilterContainer}>
                <h1>Search Collection</h1>
                <div className={styles.tabs}>
                    <button onClick={() => handleTabSwitch('artwork')} className={activeTab === 'artwork' ? styles.activeTab : ''}>
                        Artwork
                    </button>
                    <button onClick={() => handleTabSwitch('artist')} className={activeTab === 'artist' ? styles.activeTab : ''}>
                        Artist
                    </button>
                </div>
            </div>

            {/* Display Artwork or Artist */}
            <div>
                {activeTab === 'artwork' ? (
                    <>
                        <ArtworkCard artwork_={artworks} onCardClick={openArtworkModal} />
                        {isArtworkModalOpen && (
                            <ArtworkModalUser artwork_={selectedArtwork} onClose={closeArtworkModal} />
                        )}   
                    </>
                ) : (
                    <>
                        <ArtistCard artist_={artists} onCardClick={openArtistModal} />
                        {isArtistModalOpen && (
                            <ArtistModalUser artist_={selectedArtist} onClose={closeArtistModal} onRefresh={onRefresh} />
                        )}   
                    </>
                )}
            </div>
        </div>
    );
};

export default ArtLookUp;