// src/components/AnnouncementCard.jsx

import React from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
} from '@mui/material';
import { styled } from '@mui/system';

const priorityColors = {
    high: '#FF4C4C', // Red
    medium: '#FFC107', // Yellow
    low: '#4CAF50', // Green
};

const StyledCard = styled(Card)(({ priority }) => ({
    borderLeft: `5px solid ${priorityColors[priority] || '#4CAF50'}`,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const AnnouncementCard = ({ announcement, onCardClick }) => {
    const { title, content, priority } = announcement;

    return (
        <StyledCard priority={priority}>
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
                        }}
                    >
                        {title}
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
