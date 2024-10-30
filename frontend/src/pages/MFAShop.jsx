// src/pages/MFAShop.jsx
import React, { useState, useEffect } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import MFAShopCard from '../components/MFAShopCard';
import MFAShopModalUser from '../components/MFAShopModalUser';
import ShopImage from '../assets/art.png';
import styles from '../css/MFAShop.module.css';

const MFAShop = () => {
    const [shopItems, setShopItems] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('name_asc');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('${process.env.REACT_APP_API_URL}/giftshopitems')
            .then(response => response.json())
            .then(data => setShopItems(data))
            .catch(error => console.error('Error fetching shop items:', error));
    }, []);

    // Handle card click to show modal
    const handleCardClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Filter and sort shop items
    const filteredItems = shopItems
        .filter((item) => {
            return (
                item.name_.toLowerCase().includes(query.toLowerCase()) &&
                (!selectedCategory || item.category === selectedCategory)
            );
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'name_asc': return a.name_.localeCompare(b.name_);
                case 'name_desc': return b.name_.localeCompare(a.name_);
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                default: return 0;
            }
        });

    // Get unique category options
    const categoryOptions = [...new Set(shopItems.map(item => item.category))];

    return (
        <div>
            <HomeNavBar />
            <div className={styles.ShopContainer}>
                <div className={styles.ImageContainer}>
                    <img src={ShopImage} alt="Shop" className={styles.HalfBackgroundImage} />
                    <div className={styles.overlay}>
                        <h1 className={styles.title}>MFA Shop</h1>
                    </div>
                </div>

                <div className={styles.FilterContainer}>
                    <h1>Shop Collection</h1>
                    <div className={styles.search}>
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <h2>Filter By</h2>
                    <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                        <option value="">Category</option>
                        {categoryOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>

                    <h2>Sort By</h2>
                    <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                        <option value="name_asc">Name A-Z</option>
                        <option value="name_desc">Name Z-A</option>
                        <option value="price_asc">Price Low to High</option>
                        <option value="price_desc">Price High to Low</option>
                    </select>
                </div>

                {/* Display filtered items */}
                <div>
                    {filteredItems.length > 0 ? (
                        <MFAShopCard items={filteredItems} onCardClick={handleCardClick} />
                    ) : (
                        <p>No items found matching your query.</p>
                    )}
                    {isModalOpen && selectedItem && (
                        <MFAShopModalUser item={selectedItem} onClose={closeModal} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MFAShop;
