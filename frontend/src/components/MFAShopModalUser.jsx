// src/components/MFAShopModalUser.jsx
import React, { useState, useContext } from 'react';
import { Modal, Box, Typography, Button, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { CartContext } from './CartContext';
import axios from 'axios';

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

const MFAShopModalUser = ({ item, onClose, isEditing }) => {
    const { addToCart } = useContext(CartContext);
    const [itemData, setItemData] = useState({
        name_: item ? item.name_ : '',
        category: item ? item.category : '',
        price: item ? item.price : '',
        quantity: item ? item.quantity : '',
    });
    const [imageFile, setImageFile] = useState(null);

    const getImageUrl = (itemId) => {
        return `${process.env.REACT_APP_API_URL}/giftshopitems/${itemId}/image`;
    };

    const handleInputChange = (e) => {
        setItemData({ ...itemData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to send form data including the file
        const formData = new FormData();
        formData.append('name_', itemData.name_);
        formData.append('category', itemData.category);
        formData.append('price', itemData.price);
        formData.append('quantity', itemData.quantity);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (item && isEditing) {
                // Update existing item
                await axios.put(`${process.env.REACT_APP_API_URL}/giftshopitems/${item.item_id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Create new item
                await axios.post(`${process.env.REACT_APP_API_URL}/giftshopitems`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            // Handle success (e.g., show a success message, refresh items)
            onClose();
        } catch (error) {
            console.error('Error uploading item:', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <Modal open={true} onClose={onClose}>
            <Box sx={modalStyle}>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <Typography variant="h5" gutterBottom>
                            {item ? 'Edit Item' : 'Add New Item'}
                        </Typography>

                        <TextField
                            fullWidth
                            label="Item Name"
                            name="name_"
                            value={itemData.name_}
                            onChange={handleInputChange}
                            required
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Category"
                            name="category"
                            value={itemData.category}
                            onChange={handleInputChange}
                            required
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={itemData.price}
                            onChange={handleInputChange}
                            required
                            inputProps={{ step: '0.01' }}
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={itemData.quantity}
                            onChange={handleInputChange}
                            required
                            sx={{ mt: 2 }}
                        />

                        <InputLabel sx={{ mt: 2 }}>Upload Image</InputLabel>
                        <input type="file" name="image" onChange={handleFileChange} accept="image/*" />

                        {item && (
                            <img
                                src={getImageUrl(item.item_id)}
                                alt={item.name_}
                                style={{ width: '100%', borderRadius: '10px', marginTop: '20px' }}
                            />
                        )}

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <StyledButton onClick={onClose}>Cancel</StyledButton>
                            <StyledButton type="submit">{item ? 'Update Item' : 'Add Item'}</StyledButton>
                        </Box>
                    </form>
                ) : (
                    <>
                        <img
                            src={getImageUrl(item.item_id)}
                            alt={item.name_}
                            style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }}
                        />
                        <Typography variant="h5" gutterBottom>
                            {item.name_}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Category:</strong> {item.category || 'N/A'}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {item.description || 'No description available.'}
                        </Typography>
                        <StyledButton onClick={() => addToCart(item)} sx={{ marginTop: '20px' }}>
                            Add to Cart
                        </StyledButton>
                    </>
                )}
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
