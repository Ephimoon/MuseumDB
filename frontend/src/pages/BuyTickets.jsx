import React, { useState } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import '../css/BuyTickets.css';

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

  const handleIncrement = (type) => {
    setTicketCounts(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  const handleDecrement = (type) => {
    setTicketCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  };

  const calculateTotal = () => {
    return Object.entries(ticketCounts).reduce((total, [type, count]) => {
      return total + (count * prices[type]);
    }, 0);
  };

  const handlePurchase = () => {
    if (calculateTotal() > 0) {
      // I might need to add some type of  payment processing logic here
      alert(`Total Purchase: $${calculateTotal()}`);
    }
  };

  return (
    <div className="tickets-container">
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