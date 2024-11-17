// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CartProvider } from './components/CartContext';
import { TicketCartProvider } from './components/TicketCartContext';

ReactDOM.render(
    <React.StrictMode>
        <CartProvider>
            <TicketCartProvider>
                <App />
            </TicketCartProvider>
        </CartProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
