// src/components/MFAShopModalUser.jsx
import React, { useContext } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import { CartContext } from './CartContext';
import config from '../config';

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

const MFAShopModalUser = ({ item, onClose }) => {
    const { addToCart } = useContext(CartContext);

    const getImageUrl = (itemId) => {
        return `${config.backendUrl}/giftshopitems/${itemId}/image`;
    };

    const formattedPrice = item.price ? `$${parseFloat(item.price).toFixed(2)}` : 'N/A';

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={modalStyle}>
                <img
                    src={getImageUrl(item.item_id)}
                    alt={item.name_}
                    style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
                />
                <Typography variant="h5" gutterBottom>{item.name_}</Typography>
                <Typography variant="body1" gutterBottom><strong>Price:</strong> {formattedPrice}</Typography>
                <Typography variant="body1" gutterBottom><strong>Category:</strong> {item.category || 'N/A'}</Typography>
                <Typography variant="body2" gutterBottom>{item.description || 'No description available.'}</Typography>
                <StyledButton
                    onClick={() => addToCart(item)}
                    sx={{ marginTop: '20px' }}
                >
                    Add to Cart
                </StyledButton>
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
    maxWidth: 450,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

export default MFAShopModalUser;
