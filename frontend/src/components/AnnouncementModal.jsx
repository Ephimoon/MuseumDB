// src/components/AnnouncementModal.jsx

import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const priorityColors = {
    high: '#FF4C4C',
    medium: '#FFC107',
    low: '#4CAF50',
};

const StyledButton = styled(Button)({
    padding: '8px 12px',
    fontSize: '14px',
    color: '#FFFFFF',
    background: '#352F36',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    '&:hover': {
        background: '#5D595E',
    },
});

const AnnouncementModal = ({ announcement, onClose }) => {
    const { title, content, priority, created_at } = announcement;

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                        color: priorityColors[priority] || '#4CAF50',
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {new Date(created_at).toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: '20px' }}>
                    {content}
                </Typography>
                <Box sx={{ marginTop: '30px', textAlign: 'right' }}>
                    <StyledButton onClick={onClose}>Close</StyledButton>
                </Box>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

export default AnnouncementModal;
