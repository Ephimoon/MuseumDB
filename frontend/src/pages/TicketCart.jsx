import React, { useContext } from 'react';
import { TicketCartContext } from '../components/TicketCartContext';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Cart.module.css';
import HomeNavBar from '../components/HomeNavBar';

const TicketCart = () => {
    const {
        ticketCartItems,
        removeFromTicketCart,
        updateTicketQuantity,
        clearTicketCart,
    } = useContext(TicketCartContext);
    const navigate = useNavigate();

    const totalAmount = ticketCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleQuantityChange = (ticket_type_id, visitDate, e) => {
        const quantity = parseInt(e.target.value);
        if (quantity >= 1) {
            updateTicketQuantity(ticket_type_id, visitDate, quantity);
        } else {
            alert('Quantity must be at least 1.');
        }
    };

    const handleGoBack = () => {
        navigate('/'); // Navigate back to ticket purchasing page
    };

    return (
        <div>
            <HomeNavBar />
            <div className={styles.cartContainer}>
                <h1>Your Ticket Cart</h1>
                {ticketCartItems.length === 0 ? (
                    <p>Your ticket cart is empty.</p>
                ) : (
                    <table className={styles.cartTable}>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Ticket</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Visit Date</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ticketCartItems.map((item, index) => (
                            <tr key={`${item.ticket_type_id}-${item.visitDate}`}>
                                <td>{index + 1}</td>
                                <td>{item.name_}</td>
                                <td>${parseFloat(item.price).toFixed(2)}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.ticket_type_id, item.visitDate, e)}
                                        className={styles.quantityInput}
                                    />
                                </td>
                                <td>{item.visitDate}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeFromTicketCart(item.ticket_type_id, item.visitDate)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {ticketCartItems.length > 0 && (
                    <div className={styles.cartSummary}>
                        <h2>Total: ${totalAmount.toFixed(2)}</h2>
                        <div className={styles.buttonGroup}>
                            <button className={styles.clearCartButton} onClick={clearTicketCart}>
                                Clear Cart
                            </button>
                            <button
                                className={styles.proceedToCheckoutButton}
                                onClick={() => navigate('/ticket-checkout')}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                        <button className={styles.goBackButton} onClick={handleGoBack}>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCart;
