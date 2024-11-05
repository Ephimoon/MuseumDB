// src/components/AnnouncementDisplay.jsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementModal from './AnnouncementModal';
import styles from '../css/AnnouncementsDisplay.module.css';

const AnnouncementDisplay = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/announcements/user`, {
            headers: { 'user-id': userId, role },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch announcements');
                }
                return response.json();
            })
            .then((data) => {
                setAnnouncements(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching announcements:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    // Handle card click to show modal
    const handleCardClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return <Typography>Loading announcements...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    if (announcements.length === 0) {
        return null; // No announcements to display
    }

    return (
        <Box className={styles.announcementsContainer}>
            <Typography
                variant="h5"
                component="h2"
                gutterBottom
                align="center"
                className={styles.title}
            >
                Announcements
            </Typography>

            <Grid container spacing={2}>
                {announcements.map((announcement) => (
                    <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                        <AnnouncementCard
                            announcement={announcement}
                            onCardClick={handleCardClick}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Modal for announcement details */}
            {isModalOpen && selectedAnnouncement && (
                <AnnouncementModal
                    announcement={selectedAnnouncement}
                    onClose={closeModal}
                />
            )}
        </Box>
    );
};

export default AnnouncementDisplay;
