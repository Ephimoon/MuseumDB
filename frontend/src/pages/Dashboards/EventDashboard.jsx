import React, { useState } from 'react';
import '../../css/event_director.css'

const EventDirectorDashboard = () => {
    const [eventCards, setEventCards] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName, setUserName] = useState('User');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [reportData, setReportData] = useState(null); // State to store report data

    const addEventCard = () => {
        const eventDate = prompt("Enter event date (YYYY-MM-DD):");
        if (eventDate) {
            setEventCards([...eventCards, { id: Date.now(), date: new Date(eventDate), name: `Event ${eventCards.length + 1}` }]);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Get current date
    const currentDate = new Date();

    // Separate active and archived events
    const activeEvents = eventCards.filter(event => event.date >= currentDate);
    const archivedEvents = eventCards.filter(event => event.date < currentDate);

    // Handle event selection for reports
    const handleEventSelection = (e) => {
        setSelectedEventId(e.target.value);
    };

    // Simulate fetching report data for a specific event
    const fetchReport = (eventId) => {
        if (!eventId) {
            alert('Please select an event.');
            return;
        }

        // Dummy report data
        const dummyReportData = {
            totalMembers: Math.floor(Math.random() * 100),
            totalRevenue: (Math.random() * 10000).toFixed(2)
        };

        // Simulate report data fetching
        setReportData(dummyReportData);
    };

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

                {activeTab === 'dashboard' && (
                    <div className="events">
                        <h3>Events</h3>
                        <button className="add_event" onClick={addEventCard}>Add Event</button>

                        {/* Event Cards */}
                        <div className="event-cards-container">
                            {activeEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    {/*<p>{event.name}</p>*/}
                                    <button>Edit</button>
                                    <button className="Remove">Remove</button>
                                    <button>View Members</button>
                                </div>
                            ))}
                        </div>

                        {/* Archive Section */}
                        <div className="archive">
                            <h3>Archive</h3>
                            <div className="event-cards-container">
                                {archivedEvents.map((event) => (
                                    <div key={event.id} className="event-card">
                                        <p>Archived Event Date: {event.date.toDateString()}</p>
                                        <button className="Remove">Remove</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="reports-section">
                        <h3>Generate Event Reports</h3>

                        {/* Dropdown to select an event */}
                        <label htmlFor="eventSelect">Select Event:</label>
                        <select id="eventSelect" value={selectedEventId} onChange={handleEventSelection}>
                            <option value="">-- Select an Event --</option>
                            {eventCards.map(event => (
                                <option key={event.id} value={event.id}>
                                    {event.name} (Date: {event.date.toDateString()})
                                </option>
                            ))}
                        </select>

                        {/* Button to generate the report */}
                        <button onClick={() => fetchReport(selectedEventId)}>Generate Report</button>

                        {/* Display the report */}
                        {reportData && (
                            <div className="report">
                                <h4>Report for Event:</h4>
                                <p><strong>Total Members Signed Up:</strong> {reportData.totalMembers}</p>
                                <p><strong>Total Revenue Generated:</strong> ${reportData.totalRevenue}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDirectorDashboard;
