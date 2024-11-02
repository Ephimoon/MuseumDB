// src/pages/Checkout.jsx
import React, { useContext, useState } from 'react';
import { CartContext } from '../components/CartContext';
import HomeNavBar from '../components/HomeNavBar';
import styles from '../css/Checkout.module.css';

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const [transactionStatus, setTransactionStatus] = useState(null);

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        // Prepare data for backend
        const transactionData = {
            transaction_date: new Date().toISOString(),
            total_amount: totalAmount,
            transaction_type: 'credit', // or 'cash', 'debit', depending on your implementation
            items: cartItems.map(item => ({
                item_id: item.item_id,
                quantity: item.quantity,
            })),
        };

        // Send data to backend
        fetch('${process.env.REACT_APP_API_URL}/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Transaction failed');
                }
                return response.json();
            })
            .then(data => {
                setTransactionStatus('success');
                clearCart();
            })
            .catch(error => {
                console.error('Error processing transaction:', error);
                setTransactionStatus('error');
            });
    };

    return (
        <div>
            <HomeNavBar />
            <div className={styles.checkoutContainer}>
                <h1>Checkout</h1>
                {transactionStatus === 'success' ? (
                    <p>Your transaction was successful!</p>
                ) : transactionStatus === 'error' ? (
                    <p>There was an error processing your transaction. Please try again.</p>
                ) : (
                    <>
                        <h2>Order Summary</h2>
                        <ul>
                            {cartItems.map(item => (
                                <li key={item.item_id}>
                                    {item.name_} x {item.quantity} - ${parseFloat(item.price * item.quantity).toFixed(2)}
                                </li>
                            ))}
                        </ul>
                        <h3>Total: ${totalAmount.toFixed(2)}</h3>
                        {/* Placeholder for payment details */}
                        <button onClick={handleCheckout}>Confirm Purchase</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Checkout;
