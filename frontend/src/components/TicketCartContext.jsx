import React, { createContext, useState } from 'react';

export const TicketCartContext = createContext();

export const TicketCartProvider = ({ children }) => {
    const [ticketItems, setTicketItems] = useState([]);

    const addTicketToCart = (ticket) => {
        setTicketItems((prevItems) => {
            const existingTicket = prevItems.find(
                (t) => t.name_ === ticket.name_ && t.visitDate === ticket.visitDate
            );
            if (existingTicket) {
                return prevItems.map((t) =>
                    t.name_ === ticket.name_ && t.visitDate === ticket.visitDate
                        ? { ...t, quantity: t.quantity + ticket.quantity }
                        : t
                );
            }
            return [...prevItems, ticket];
        });
    };

    const clearTicketCart = () => setTicketItems([]);

    const removeTicketFromCart = (ticket) => {
        setTicketItems((prevItems) =>
            prevItems.filter(
                (t) => !(t.name_ === ticket.name_ && t.visitDate === ticket.visitDate)
            )
        );
    };

    return (
        <TicketCartContext.Provider value={{ ticketItems, addTicketToCart, clearTicketCart, removeTicketFromCart }}>
            {children}
        </TicketCartContext.Provider>
    );
};
