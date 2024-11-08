// src/components/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load initial cart items from localStorage
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    useEffect(() => {
        // Save cart items to localStorage whenever cartItems change
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        console.log('Adding to cart:', item); // Debugging line
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(i => String(i.item_id) === String(item.item_id));
            if (existingItem) {
                if (existingItem.quantity + 1 > existingItem.stock) {
                    alert(`Only ${existingItem.stock} units of this item are available.`);
                    return prevItems;
                }
                return prevItems.map(i =>
                    String(i.item_id) === String(item.item_id) ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (item_id) => {
        setCartItems((prevItems) => prevItems.filter(i => i.item_id !== item_id));
    };

    const updateQuantity = (item_id, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map(i =>
                i.item_id === item_id ? { ...i, quantity } : i
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
