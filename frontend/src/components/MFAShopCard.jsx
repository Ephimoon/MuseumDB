// src/components/MFAShopCard.jsx
import React, { useContext } from 'react';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Typography,
    Button,
    CardActions,
} from '@mui/material';
import { styled } from '@mui/system';
import { CartContext } from './CartContext';

const StyledButton = styled(Button)({
    padding: '8px 12px',
    marginRight: '5px',
    fontSize: '14px',
    color: '#FFFFFF',
    background: 'linear-gradient(90deg, #BD2859 0%, #D22D36 100%)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(90deg, #D22D36 0%, #BD2859 100%)',
    },
});

const MFAShopCard = ({ item, onCardClick }) => {
    const { addToCart } = useContext(CartContext);

    const getImageUrl = (itemId) => {
        return `http://localhost:8080/giftshopitems/${itemId}/image`;
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea
                onClick={() => onCardClick(item)}
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <CardMedia
                    component="img"
                    image={getImageUrl(item.item_id)}
                    alt={item.name_}
                    sx={{ height: 200 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {item.name_}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ${parseFloat(item.price).toFixed(2)}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <StyledButton
                    fullWidth
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering modal
                        addToCart(item);
                    }}
                >
                    Add to Cart
                </StyledButton>
            </CardActions>
        </Card>
    );
};

export default MFAShopCard;
