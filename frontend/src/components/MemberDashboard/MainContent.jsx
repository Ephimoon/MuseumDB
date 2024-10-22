import React from 'react';
import EventCard from './EventCard';
import '../../css/MemberDashboard/MemberDashboard.css';

const MainContent = () => {
  return (
    <div className="main-content">
      <h2>Bought Tickets</h2>
      <div className="tickets-section">
        {/* Example for bought tickets */}
        <p>You have not bought any tickets yet.</p>
      </div>
      
      <h2>Sign up for Events</h2>
      <div className="events-section">
        {/* Render Event Cards here */}
        <EventCard eventName="Art Exhibition" eventDescription="An amazing exhibition" />
        <EventCard eventName="Museum Tour" eventDescription="Exclusive tour of the museum" />
      </div>
    </div>
  );
};

export default MainContent;
