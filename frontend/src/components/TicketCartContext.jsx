import React, { createContext, useState } from 'react';

export const TicketCartContext = createContext();

export const TicketCartProvider = ({ children }) => {
    const [ticketCartItems, setTicketCartItems] = useState([]);

    const addTicketToCart = (ticketItem) => {
        setTicketCartItems((prevItems) => {
            // Check if the same ticket type ID and date already exist
            const existingItemIndex = prevItems.findIndex(
                (item) =>
                    item.ticket_type_id === ticketItem.ticket_type_id &&
                    item.visitDate === ticketItem.visitDate
            );

            if (existingItemIndex !== -1) {
                // Update the quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex].quantity += ticketItem.quantity;
                return updatedItems;
            } else {
                // Add new ticket item
                return [...prevItems, ticketItem];
            }
        });
    };

    const removeFromTicketCart = (ticket_type_id, visitDate) => {
        setTicketCartItems((prevItems) =>
            prevItems.filter(
                (item) => item.ticket_type_id !== ticket_type_id || item.visitDate !== visitDate
            )
        );
    };

    const updateTicketQuantity = (ticket_type_id, visitDate, quantity) => {
        setTicketCartItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.ticket_type_id === ticket_type_id && item.visitDate === visitDate) {
                    return { ...item, quantity };
                }
                return item;
            });
        });
    };

    const clearTicketCart = () => {
        setTicketCartItems([]);
    };

    return (
        <TicketCartContext.Provider
            value={{
                ticketCartItems,
                addTicketToCart,
                removeFromTicketCart,
                updateTicketQuantity,
                clearTicketCart,
            }}
        >
            {children}
        </TicketCartContext.Provider>
    );
};
