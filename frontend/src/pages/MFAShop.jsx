import React, { useState } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import { MFAShopCard, MFAShopModalUser } from '../components/MFAShopCard';
import ShopImage from '../assets/art.png';
import styles from '../css/MFAShop.module.css';

const MFAShop = () => {
    const shopItems = [
        { id: 1, image: "https://placehold.jp/500x400.png", name: 'Museum T-Shirt', category: 'Apparel', price: '$25.00', description: 'Soft cotton t-shirt with museum logo' },
        { id: 2, image: "https://placehold.jp/500x400.png", name: 'Coffee Mug', category: 'Home Goods', price: '$15.00', description: 'Ceramic mug with museum print' },
        { id: 3, image: "https://placehold.jp/500x400.png", name: 'Art Book', category: 'Books', price: '$50.00', description: 'Hardcover book with art collections' },
        { id: 4, image: "https://placehold.jp/500x400.png", name: 'Poster', category: 'Prints', price: '$20.00', description: 'High-quality art print' },
        { id: 5, image: "https://placehold.jp/500x400.png", name: 'Museum Hat', category: 'Apparel', price: '$18.00', description: 'Museum logo baseball cap' }
    ];

    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('name_asc');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                item.name.toLowerCase().includes(query.toLowerCase()) &&
                (!selectedCategory || item.category === selectedCategory)
            );
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'name_asc': return a.name.localeCompare(b.name);
                case 'name_desc': return b.name.localeCompare(a.name);
                case 'price_asc': return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
                case 'price_desc': return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1));
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
