// src/pages/Checkout.jsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext';
import HomeNavBar from '../components/HomeNavBar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styles from '../css/Checkout.module.css'; // Import Checkout-specific styles

const Checkout = () => {
    const { cartItems, clearCart, updateQuantity } = useContext(CartContext);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxRate = 0.0825; // 8.25% tax
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax;

    const navigate = useNavigate(); // Initialize navigate

    // Retrieve user credentials from localStorage or your auth context
    const userId = localStorage.getItem('userId'); // Adjust based on your auth implementation
    const role = localStorage.getItem('role');     // Adjust based on your auth implementation

    const handleCheckout = () => {
        // Prepare data for backend
        const transactionData = {
            payment_method: 'credit', // Replace with actual payment method from user input if available
            items: cartItems.map(item => ({
                item_id: item.item_id,
                quantity: item.quantity,
            })),
        };

        // Validate user credentials
        if (!userId || !role) {
            setTransactionStatus('error');
            setErrorMessage('User is not authenticated.');
            return;
        }

        // Send data to backend
        fetch(`${process.env.REACT_APP_API_URL}/checkout`, { // Ensure this endpoint matches your backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userId, // Add user-id header
                'role': role,      // Add role header
            },
            body: JSON.stringify(transactionData),
        })
            .then(async response => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Transaction failed');
                }
                return data;
            })
            .then(data => {
                setTransactionStatus('success');
                clearCart();
            })
            .catch(error => {
                console.error('Error processing transaction:', error);
                setErrorMessage(error.message);
                setTransactionStatus('error');
            });
    };

    const handleGoBack = () => {
        navigate('/cart'); // Navigate back to the cart page
    };

    return (
        <div>
            <HomeNavBar />
            <div className={styles.checkoutContainer}>
                <h1>Checkout</h1>
                {transactionStatus === 'success' ? (
                    <div className={styles.successMessage}>
                        <p>Your transaction was successful!</p>
                        <button
                            className={styles.goBackButton}
                            onClick={() => navigate('/')}
                        >
                            Return to Home
                        </button>
                    </div>
                ) : transactionStatus === 'error' ? (
                    <div className={styles.errorMessage}>
                        <p>There was an error processing your transaction: {errorMessage}</p>
                        <button
                            className={styles.goBackButton}
                            onClick={handleGoBack}
                        >
                            Go Back to Cart
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.orderSummary}>
                            <h2>Order Summary</h2>
                            <table className={styles.orderTable}>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={item.item_id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name_}</td>
                                        <td>${parseFloat(item.price).toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className={styles.financials}>
                                <div className={styles.financialRow}>
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className={styles.financialRow}>
                                    <span>Tax (8.25%):</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className={styles.financialRow}>
                                    <span>Total:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        {/* Button Group */}
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.clearCartButton} // Preserving original class name
                                onClick={handleCheckout}
                            >
                                Confirm Purchase
                            </button>
                            <button
                                className={styles.goBackButton}
                                onClick={handleGoBack}
                            >
                                Go Back to Cart
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

};

export default Checkout;
