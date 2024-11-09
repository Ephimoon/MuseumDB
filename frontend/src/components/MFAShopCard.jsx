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
    Box,
    Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import { CartContext } from './CartContext';
import config from '../config';

const LOW_STOCK_THRESHOLD = 10;

const StyledButton = styled(Button)(({ disabled }) => ({
    padding: '8px 12px',
    marginRight: '5px',
    fontSize: '14px',
    color: '#FFFFFF',
    background: 'linear-gradient(90deg, #BD2859 0%, #D22D36 100%)',
    border: 'none',
    borderRadius: '5px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.3s ease, opacity 0.3s ease',
    opacity: disabled ? 0.6 : 1,
    width: '100%',
    '&:hover': {
        background: disabled
            ? 'linear-gradient(90deg, #BD2859 0%, #D22D36 100%)'
            : 'linear-gradient(90deg, #D22D36 0%, #BD2859 100%)',
    },
}));

const StyledCard = styled(Card)(({ isOutOfStock }) => ({
    opacity: isOutOfStock ? 0.6 : 1,
    filter: isOutOfStock ? 'grayscale(100%)' : 'none',
    transition: 'opacity 0.3s ease, filter 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const MFAShopCard = ({ item, onCardClick }) => {
    const { addToCart } = useContext(CartContext);

    const getImageUrl = (itemId) => {
        return `${config.backendUrl}/giftshopitems/${itemId}/image`;
    };

    const isOutOfStock = item.quantity === 0;
    const isLowStock = item.quantity > 0 && item.quantity < LOW_STOCK_THRESHOLD;

    return (
        <StyledCard isOutOfStock={isOutOfStock}>
            <CardActionArea
                onClick={() => onCardClick(item)}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                }}
            >
                {isOutOfStock && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '1.2rem',
                            borderRadius: '4px',
                            zIndex: 1,
                        }}
                    >
                        Out of Stock
                    </Box>
                )}
                <Box sx={{ width: '100%', aspectRatio: '1 / 1', overflow: 'hidden' }}>
                    <CardMedia
                        component="img"
                        image={getImageUrl(item.item_id)}
                        alt={item.name_}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px 4px 0 0',
                        }}
                    />
                </Box>
                <CardContent
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start',
                        padding: '16px',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            minHeight: '50px',
                            marginBottom: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                textAlign: 'left',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {item.name_}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            minHeight: '20px',
                            marginBottom: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: 'left' }}
                        >
                            ${parseFloat(item.price).toFixed(2)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        }}
                    >
                        {isLowStock && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#dc3545',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                }}
                            >
                                Only {item.quantity} left in stock!
                            </Typography>
                        )}
                        {isOutOfStock && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#dc3545',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                }}
                            >
                                Out of Stock
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Tooltip
                    title={
                        isOutOfStock
                            ? 'This item is currently out of stock.'
                            : 'Add this item to your cart.'
                    }
                    placement="top"
                    arrow
                >
                    <span style={{ width: '100%' }}>
                        <StyledButton
                            fullWidth
                            disabled={isOutOfStock}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!isOutOfStock) {
                                    addToCart(item);
                                }
                            }}
                        >
                            Add to Cart
                        </StyledButton>
                    </span>
                </Tooltip>
            </CardActions>
        </StyledCard>
    );
};

export default MFAShopCard;
