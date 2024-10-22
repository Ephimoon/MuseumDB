import React from 'react';
import '../../css/MemberDashboard/EventCard.css';

const EventCard = ({ eventName, eventDescription }) => {
  return (
    <div className="event-card">
      <img src="/path/to/image.jpg" alt={eventName} className="event-image" />
      <div className="event-details">
        <h3>{eventName}</h3>
        <p>{eventDescription}</p>
        <button className="sign-up-btn">Sign Up</button>
      </div>
    </div>
  );
};

export default EventCard;
