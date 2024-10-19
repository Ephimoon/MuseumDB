import React, {useState} from 'react';
import '../../css/event_director.css'

const EventDirectorDashboard = () => {
    const [eventCards, setEventCards] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName, setUserName] = useState('User');

    const addEventCard = () => {
        const eventDate = prompt("Enter event date (YYYY-MM-DD):");
        if (eventDate){
            setEventCards([...eventCards, {id: Date.now(), date: new Date(eventDate)}]);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Get current date
    const currentDate = new Date()

    // separate active and archived events
    const activeEvents = eventCards.filter(event => event.date >= currentDate);
    const archivedEvents = eventCards.filter(event => event.date < currentDate);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className="sidebar">
                <a 
                    href="#" 
                    className={`dashboard ${activeTab === 'dashboard' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('dashboard')}
                >
                    Dashboard
                </a>
                <a 
                    href="#" 
                    className={`reports ${activeTab === 'reports' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('reports')}
                >
                    Reports
                </a>
                <a 
                    href="#" 
                    className={`logout ${activeTab === 'logout' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('logout')}
                >
                    Logout
                </a>
            </div>

            {/* Main Content */}
            <div className="main-content">
                 {/* Greeting Section */}
                <div className="greeting-container">
                    <div className="greeting">
                        Hello, {userName}
                    </div>
                </div>

                {/* Events Section */}
                <div className="events">
                    <h3>Events</h3>
                    <button className="add_event" onClick={addEventCard}>Add Event</button>
                    
                    {/* Event Cards */}
                    <div className='event-cards-container'>
                        {activeEvents.map((event) => (
                            <div key={event.id} className="event-card">
                                <p>Event Date: {event.date.toDateString()}</p>
                                <button>Edit</button>
                                <button className="Remove">Remove</button>
                                <button>View Members</button>
                            </div>
                        ))}
                    </div>
                

                    {/* Archive Section */}
                    <div className="archive">
                        <h3>Archive</h3>
                        <div className='event-cards-container'>
                            {archivedEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    <p>Archived Event Date: {event.date.toDateString()}</p>
                                    <button className="Remove">Remove</button>
                                    {/* You can add more actions here if needed */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDirectorDashboard;