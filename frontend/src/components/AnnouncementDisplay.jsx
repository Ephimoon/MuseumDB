// src/components/AnnouncementDisplay.jsx

import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Skeleton,
} from '@mui/material';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementModal from './AnnouncementModal';
import styles from '../css/AnnouncementDisplay.module.css';

const AnnouncementDisplay = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
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
                setFilteredAnnouncements(data);
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

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
            if (newFilter === 'all') {
                setFilteredAnnouncements(announcements);
            } else {
                setFilteredAnnouncements(
                    announcements.filter(
                        (announcement) =>
                            announcement.priority.toLowerCase() === newFilter.toLowerCase()
                    )
                );
            }
        }
    };

    if (loading) {
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
                    {[...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" height={200} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        // Background color white
        <div className={styles.background}>
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

                <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={handleFilterChange}
                        aria-label="announcement filter"
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="high">High Priority</ToggleButton>
                        <ToggleButton value="medium">Medium Priority</ToggleButton>
                        <ToggleButton value="low">Low Priority</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {filteredAnnouncements.length === 0 ? (
                    <Typography align="center">No announcements to display.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {filteredAnnouncements.map((announcement) => (
                            <Grid item xs={12} sm={6} md={4} key={announcement.id}>
                                <AnnouncementCard
                                    announcement={announcement}
                                    onCardClick={handleCardClick}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Modal for announcement details */}
                {isModalOpen && selectedAnnouncement && (
                    <AnnouncementModal
                        announcement={selectedAnnouncement}
                        onClose={closeModal}
                    />
                )}
            </Box>
        </div>

    );
};

export default AnnouncementDisplay;
