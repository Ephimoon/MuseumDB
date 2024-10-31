// src/pages/Cart.jsx
import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import HomeNavBar from '../components/HomeNavBar';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Cart.module.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleQuantityChange = (item_id, e) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 1) {
            updateQuantity(item_id, quantity);
        }
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div>
            <HomeNavBar />
            <div className={styles.cartContainer}>
                <h1>Your Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <table className={styles.cartTable}>
                        <thead>
                        <tr>
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map(item => (
                            <tr key={item.item_id}>
                                <td>{item.name_}</td>
                                <td>${parseFloat(item.price).toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.item_id, e)}
                                    />
                                </td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => removeFromCart(item.item_id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {cartItems.length > 0 && (
                    <div className={styles.cartSummary}>
                        <h2>Total: ${totalAmount.toFixed(2)}</h2>
                        <button onClick={clearCart}>Clear Cart</button>
                        <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
