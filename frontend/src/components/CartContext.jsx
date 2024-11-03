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
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(i => i.item_id === item.item_id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i
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
