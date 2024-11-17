// src/pages/TicketCheckout.jsx
import React, { useContext, useState } from 'react';
import { TicketCartContext } from '../components/TicketCartContext';
import HomeNavBar from '../components/HomeNavBar';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Checkout.module.css'; // Use the provided CSS

const TicketCheckout = () => {
    const { ticketItems, clearTicketCart, removeTicketFromCart } = useContext(TicketCartContext);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const navigate = useNavigate();

    const subtotal = ticketItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxRate = 0.0825;
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax;

    const handleCheckout = () => {
        setTransactionStatus('success');
        clearTicketCart();
    };

    const handleGoBack = () => {
        navigate('/buytickets');
    };

    return (
        <div>
            <HomeNavBar />
            <div className={styles.checkoutContainer}>
                <h1>Ticket Checkout</h1>
                {transactionStatus === 'success' ? (
                    <div className={styles.successMessage}>
                        <p>Your ticket purchase was successful!</p>
                        <button
                            className={styles.goBackButton}
                            onClick={() => navigate('/')}
                        >
                            Return to Home
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
                                    <th>Visit Date</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ticketItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name_}</td>
                                        <td>{item.visitDate}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button
                                                className={styles.removeButton}
                                                onClick={() => removeTicketFromCart(item)}
                                            >
                                                Remove
                                            </button>
                                        </td>
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
                        <div className={styles.buttonGroup}>
                            <button
                                className={styles.clearCartButton}
                                onClick={clearTicketCart}
                            >
                                Clear Cart
                            </button>
                            <button
                                className={styles.goBackButton}
                                onClick={handleCheckout}
                            >
                                Confirm Purchase
                            </button>
                            <button
                                className={styles.goBackButton}
                                onClick={handleGoBack}
                            >
                                Go Back to Tickets
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TicketCheckout;
