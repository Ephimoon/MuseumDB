// src/pages/MFAShop.jsx

import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import HomeNavBar from '../components/HomeNavBar';
import MFAShopCard from '../components/MFAShopCard';
import MFAShopModalUser from '../components/MFAShopModalUser';
import config from '../config';

const MFAShop = () => {
    const [shopItems, setShopItems] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('name_asc');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9; // Adjust the number of items per page as needed


    useEffect(() => {
        setLoading(true);
<<<<<<< Updated upstream
        fetch(`${config.backendUrl}/giftshopitems`)
=======
        fetch(`http://localhost:5000/giftshopitems`)
>>>>>>> Stashed changes
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch shop items');
                }
                return response.json();
            })
            .then((data) => {
                // Map 'quantity' to 'stock' for clarity
                const mappedData = data.map(item => ({ ...item, stock: item.quantity }));
                console.log('Mapped shop items:', mappedData); // For debugging
                setShopItems(mappedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching shop items:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    // Handle card click to show modal
    const handleCardClick = (item) => {
        if (item.stock > 0) {
            setSelectedItem(item);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Filter shop items
    const filteredItems = shopItems.filter((item) => {
        return (
            item.name_.toLowerCase().includes(query.toLowerCase()) &&
            (!selectedCategory || item.category === selectedCategory)
        );
    });

    // Sort shop items
    const sortedItems = filteredItems.sort((a, b) => {
        switch (sortOption) {
            case 'name_asc':
                return a.name_.localeCompare(b.name_);
            case 'name_desc':
                return b.name_.localeCompare(a.name_);
            case 'price_asc':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'price_desc':
                return parseFloat(b.price) - parseFloat(a.price);
            default:
                return 0;
        }
    });

    // Calculate total pages and current items
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

    // Reset current page when filters or sorting options change
    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedCategory, sortOption]);

    // Get unique category options
    const categoryOptions = [...new Set(shopItems.map((item) => item.category))];

    return (
        <div>
            <HomeNavBar />
            <Box sx={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fcfcfc' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    align="center"
                    sx={{
                        fontFamily: 'Rosarivo, serif',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: '#352F36',
                    }}
                >
                    MFA Shop
                </Typography>

                {/* Main Content Layout */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        maxWidth: '1200px',
                        width: '100%',
                        margin: '0 auto',
                        marginTop: '20px',
                    }}
                >
                    {/* Sidebar Filter Section */}
                    <Box
                        sx={{
                            flex: '1 1 250px',
                            padding: '20px',
                            backgroundColor: '#fcfcfc',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                            marginRight: { xs: 0, md: '20px' },
                            marginBottom: { xs: '20px', md: 0 },
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Filter By
                        </Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Category"
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categoryOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Search items..."
                            variant="outlined"
                            fullWidth
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            margin="normal"
                        />
                    </Box>

                    {/* Right Side: Sort and Shop Items */}
                    <Box
                        sx={{
                            flex: '3 1 700px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '15px',
                                flexWrap: 'wrap',
                            }}
                        >
                            <Typography variant="h6">Shop Items</Typography>
                            <FormControl sx={{ minWidth: 200 }} margin="normal">
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    value={sortOption}
                                    label="Sort By"
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <MenuItem value="name_asc">Name A-Z</MenuItem>
                                    <MenuItem value="name_desc">Name Z-A</MenuItem>
                                    <MenuItem value="price_asc">Price Low to High</MenuItem>
                                    <MenuItem value="price_desc">Price High to Low</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Grid Container */}
                        <Grid container spacing={2} alignItems="stretch">
                            {loading ? (
                                <Typography>Loading items...</Typography>
                            ) : error ? (
                                <Typography>Error: {error}</Typography>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <Grid item xs={12} sm={6} md={4} key={item.item_id}>
                                        <MFAShopCard item={item} onCardClick={handleCardClick} />
                                    </Grid>
                                ))
                            ) : (
                                <Typography>No items found matching your query.</Typography>
                            )}
                        </Grid>

                        {/* Pagination Controls */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        padding: '8px 12px',
                                        margin: '0 4px',
                                        borderRadius: '4px',
                                        backgroundColor:
                                            currentPage === index + 1 ? '#BD2859' : '#D7D5D7',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Modal for item details */}
                {isModalOpen && selectedItem && (
                    <MFAShopModalUser item={selectedItem} onClose={closeModal} />
                )}
            </Box>
        </div>
    );
};

export default MFAShop;
