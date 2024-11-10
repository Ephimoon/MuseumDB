import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  const [visitDate, setVisitDate] = useState('');
  
  const prices = {
    adult: 23.99,
    senior: 19.99,
    student: 14.99,
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
    const total = Object.entries(ticketCounts).reduce((sum, [type, count]) => {
      return sum + count * prices[type];
    }, 0);

    const totalTickets = Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);

    return { total, totalTickets };
  };

  const getTotalTickets = () => {
    return Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  };

  const handlePurchase = () => {
    const { total, totalTickets } = calculateTotal();
    if (totalTickets > 0 && visitDate) {
      const formattedDate = visitDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      alert(`Total Purchase: $${total.toFixed(2)} on ${formattedDate}`);
      // Here, add logic to send the visit date and ticket data to the backend
    } else {
      alert("Please select a date and at least one ticket.");
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

        <div className="visit-date">
          <label>Select Visit Date:</label>
          <DatePicker
            selected={visitDate}
            onChange={(date) => setVisitDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select a date"
            className="custom-date-picker"
          />
        </div>
        
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
          <p className="total-amount">Total: ${calculateTotal().total.toFixed(2)}</p>
          <button 
            className="purchase-button"
            onClick={handlePurchase}
            disabled={calculateTotal().totalTickets === 0 || !visitDate}
          >
            Purchase Tickets
          </button>
        </div>
      </div>
    </div>
  );
};



export default BuyTickets;