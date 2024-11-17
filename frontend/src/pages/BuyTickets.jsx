<<<<<<< Updated upstream
import React, { useState } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import '../css/BuyTickets.css';
import TicketBackground from '../assets/TicketsBackground.png';

const BuyTickets = () => {
  const [ticketCounts, setTicketCounts] = useState({
    adult: 0,
    senior: 0,
    student: 0,
    child: 0
  });
  
  const prices = {
    adult: 24,
    senior: 20,
    student: 15,
    child: 0
  };
=======
// src/pages/BuyTickets.jsx

import React, {useContext, useState, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/BuyTickets.css';
import TicketBackground from '../assets/TicketsBackground.png';
import {TicketCartContext} from '../components/TicketCartContext';
import {useNavigate} from 'react-router-dom';
import HomeNavBar from "../components/HomeNavBar";
import axios from "axios";
const BuyTickets = () => {
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketCounts, setTicketCounts] = useState({});
    const [visitDate, setVisitDate] = useState('');
    const { addTicketToCart } = useContext(TicketCartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/ticket-types');
                setTicketTypes(response.data);

                // Initialize ticketCounts with fetched ticket types
                const initialCounts = {};
                response.data.forEach(ticket => {
                    initialCounts[ticket.ticket_type_id] = 0;
                });
                setTicketCounts(initialCounts);
            } catch (error) {
                console.error('Error fetching ticket types:', error);
            }
        };
>>>>>>> Stashed changes

        fetchTicketTypes();
    }, []);

    const handleIncrement = (ticket_type_id) => {
        setTicketCounts((prev) => ({
            ...prev,
            [ticket_type_id]: prev[ticket_type_id] + 1,
        }));
    };

<<<<<<< Updated upstream
  const calculateTotal = () => {
    return Object.entries(ticketCounts).reduce((total, [type, count]) => {
      return total + (count * prices[type]);
    }, 0);
  };

  const handlePurchase = () => {
    if (calculateTotal() > 0) {
      // I might need to add some type of payment processing logic here
      alert(`Total Purchase: $${calculateTotal()}`);
    }
  };

  return (
    <div 
      className="tickets-container"
      style={{
        backgroundImage: `linear-gradient(rgba(220, 74, 56, 0.2), rgba(220, 74, 56, 0.2)), url(${TicketBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <HomeNavBar />
      
      <div className="tickets-content">
        <h1 className="tickets-title">Purchase Tickets</h1>
        
        <div className="ticket-types">
          {Object.entries(ticketCounts).map(([type, count]) => (
            <div key={type} className="ticket-item">
              <div className="ticket-info">
                <h3 className="ticket-type">{type}</h3>
                <p className="ticket-price">${prices[type]}</p>
              </div>
              
              <div className="ticket-controls">
                <button 
                  className="control-button"
                  onClick={() => handleDecrement(type)}
                >
                  -
                </button>
                <span className="ticket-count">{count}</span>
                <button 
                  className="control-button"
                  onClick={() => handleIncrement(type)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="purchase-section">
          <p className="total-amount">Total: ${calculateTotal()}</p>
          <button 
            className="purchase-button"
            onClick={handlePurchase}
            disabled={calculateTotal() === 0}
          >
            Purchase Tickets
          </button>
        </div>
      </div>
    </div>
  );
};



export default BuyTickets;
=======
    const handleDecrement = (ticket_type_id) => {
        setTicketCounts((prev) => ({
            ...prev,
            [ticket_type_id]: Math.max(0, prev[ticket_type_id] - 1),
        }));
    };

    const calculateTotal = () => {
        let total = 0;
        let totalTickets = 0;
        ticketTypes.forEach(ticket => {
            const count = ticketCounts[ticket.ticket_type_id] || 0;
            total += count * ticket.price;
            totalTickets += count;
        });
        return { total, totalTickets };
    };

    const handleAddToCart = () => {
        const { totalTickets } = calculateTotal();
        if (totalTickets > 0 && visitDate) {
            const formattedDate = visitDate.toISOString().split('T')[0];

            // Prepare the ticket items for the cart with correct quantities
            ticketTypes.forEach((ticket) => {
                const count = ticketCounts[ticket.ticket_type_id];
                if (count > 0) {
                    addTicketToCart({
                        ticket_type_id: ticket.ticket_type_id,
                        name_: ticket.admission_type + ' - ' + ticket.price_category,
                        price: ticket.price,
                        quantity: count,
                        visitDate: formattedDate,
                    });
                }
            });

            // Reset ticket counts after adding to cart
            const resetCounts = {};
            ticketTypes.forEach(ticket => {
                resetCounts[ticket.ticket_type_id] = 0;
            });
            setTicketCounts(resetCounts);

            alert('Tickets added to cart!');
            navigate('/buytickets');
        } else {
            alert('Please select a date and at least one ticket.');
        }
    };

    return (
        <div>
            <HomeNavBar />
            <div className="tickets-container" style={{ /* your styles */ }}>
                <div className="tickets-content">
                    <h1 className="tickets-title">Purchase Tickets</h1>

                    <div className="visit-date">
                        <label>Select Visit Date:</label>
                        <DatePicker
                            selected={visitDate}
                            onChange={(date) => setVisitDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select a date"
                            className="custom-date-picker"
                            minDate={new Date()}
                            filterDate={(date) => {
                                const day = date.getDay();
                                return day !== 1 && day !== 2; // Exclude Mondays and Tuesdays
                            }}
                        />
                    </div>

                    <div className="ticket-types">
                        {ticketTypes.map((ticket) => (
                            <div key={ticket.ticket_type_id} className="ticket-item">
                                <div className="ticket-info">
                                    <h3 className="ticket-type">
                                        {ticket.admission_type} - {ticket.price_category}
                                    </h3>
                                    <p className="ticket-price">${ticket.price.toFixed(2)}</p>
                                </div>

                                <div className="ticket-controls">
                                    <button className="control-button" onClick={() => handleDecrement(ticket.ticket_type_id)}>
                                        -
                                    </button>
                                    <span className="ticket-count">{ticketCounts[ticket.ticket_type_id]}</span>
                                    <button className="control-button" onClick={() => handleIncrement(ticket.ticket_type_id)}>
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="purchase-section">
                        <p className="total-amount">Total: ${calculateTotal().total.toFixed(2)}</p>
                        <button
                            className="purchase-button"
                            onClick={handleAddToCart}
                            disabled={calculateTotal().totalTickets === 0 || !visitDate}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyTickets;
>>>>>>> Stashed changes
