// src/pages/Cart.jsx
import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import HomeNavBar from '../components/HomeNavBar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styles from '../css/Cart.module.css'; // Import Cart-specific styles

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const navigate = useNavigate(); // Initialize navigate

    const handleQuantityChange = (item_id, e) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 1) {
            updateQuantity(item_id, quantity);
        }
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleGoBack = () => {
        navigate('/MFAShop'); // Navigate back to home or desired page
    };

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
                            <th>#</th> {/* Sequence Number Column */}
                            <th>Item</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={item.item_id}>
                                <td>{index + 1}</td> {/* Display Sequence Number */}
                                <td>{item.name_}</td>
                                <td>${parseFloat(item.price).toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.item_id, e)}
                                        className={styles.quantityInput}
                                    />
                                </td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeFromCart(item.item_id)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {cartItems.length > 0 && (
                    <div className={styles.cartSummary}>
                        <h2>Total: ${totalAmount.toFixed(2)}</h2>
                        {/* Button Group */}
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.clearCartButton}
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                            <button
                                className={styles.proceedToCheckoutButton}
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                        {/* Go Back to Shopping */}
                        <button
                            className={styles.goBackButton}
                            onClick={handleGoBack}
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
