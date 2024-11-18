import React, { useContext, useState } from 'react';
import { TicketCartContext } from '../components/TicketCartContext';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Checkout.module.css';

const TicketCheckout = () => {
    const { ticketCartItems, clearTicketCart } = useContext(TicketCartContext);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit');

    const subtotal = ticketCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
    const taxRate = 0.0825; // 8.25% tax
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax;

    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    const handleCheckout = () => {
        if (!userId || !role) {
            setTransactionStatus('error');
            setErrorMessage('User is not authenticated.');
            return;
        }

        const transactionData = {
            payment_method: paymentMethod,
            tickets: ticketCartItems.map((item) => ({
                ticket_type_id: item.ticket_type_id,
                quantity: item.quantity,
                visit_date: item.visitDate, // Include visit date
            })),
        };

        console.log('ticketCartItems:', ticketCartItems);
        console.log('transactionData:', transactionData);

        if (transactionData.tickets.some(ticket => !ticket.ticket_type_id)) {
            setTransactionStatus('error');
            setErrorMessage('Invalid ticket data.');
            return;
        }

        fetch(`http://localhost:5000/ticket-purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'user-id': userId,
                role: role,
            },
            body: JSON.stringify(transactionData),
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Transaction failed');
                }
                return data;
            })
            .then((data) => {
                setTransactionStatus('success');
                clearTicketCart();
            })
            .catch((error) => {
                console.error('Error processing transaction:', error);
                setErrorMessage(error.message);
                setTransactionStatus('error');
            });
    };

    const handleGoBack = () => {
        navigate('/ticket-cart');
    };

    return (
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
            ) : transactionStatus === 'error' ? (
                <div className={styles.errorMessage}>
                    <p>There was an error processing your transaction: {errorMessage}</p>
                    <button className={styles.goBackButton} onClick={handleGoBack}>
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
                                <th>Ticket</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Visit Date</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ticketCartItems.map((item, index) => (
                                <tr key={`${item.ticket_type_id}-${item.visitDate}`}>
                                    <td>{index + 1}</td>
                                    <td>{item.name_}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.visitDate}</td>
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
                    {/* Payment Method Selection */}
                    <div className={styles.paymentMethod}>
                        <label htmlFor="paymentMethod">Payment Method:</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                            <option value="cash">Cash</option>
                        </select>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.clearCartButton}
                            onClick={handleCheckout}
                        >
                            Confirm Purchase
                        </button>
                        <button className={styles.goBackButton} onClick={handleGoBack}>
                            Go Back to Cart
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TicketCheckout;
