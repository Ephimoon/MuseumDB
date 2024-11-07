// src/components/AnnouncementCard.jsx

import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LowPriorityIcon from '@mui/icons-material/LowPriority';

const priorityColors = {
    high: '#FF4C4C', // Red
    medium: '#FFC107', // Yellow
    low: '#4CAF50', // Green
};

const priorityIcons = {
    high: <PriorityHighIcon sx={{ color: priorityColors.high }} />,
    medium: <WarningAmberIcon sx={{ color: priorityColors.medium }} />,
    low: <LowPriorityIcon sx={{ color: priorityColors.low }} />,
};

const StyledCard = styled(Card)(({ priority }) => ({
    borderLeft: `5px solid ${priorityColors[priority] || '#4CAF50'}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.02)',
    },
}));

const AnnouncementCard = ({ announcement, onCardClick }) => {
    const { title, content, priority } = announcement;

    return (
        <StyledCard priority={priority} elevation={3}>
            <CardActionArea
                onClick={() => onCardClick(announcement)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                            color: priorityColors[priority] || '#4CAF50',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {priorityIcons[priority]}
                        <span style={{ marginLeft: '8px' }}>{title}</span>
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {content}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </StyledCard>
    );
};

export default AnnouncementCard;
