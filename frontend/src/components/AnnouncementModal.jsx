// src/components/AnnouncementModal.jsx

import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

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
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                            color: priorityColors[priority] || '#4CAF50',
                            fontWeight: 'bold',
                            marginRight: '40px', // Adjust for close button
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
