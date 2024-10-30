import React, { useState } from 'react';
import '../../css/event_director.css'
import logo from '../../assets/LOGO.png';
import axios from 'axios';


const EventDirectorDashboard = () => {
    const [eventCards, setEventCards] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName, setUserName] = useState('User');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [reportData, setReportData] = useState(null); // State to store report data
    const [membersList, setMembersList] = useState([]); // State to store members list
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false); // State to control members modal

    const addEventCard = () => {
        const eventDate = prompt("Enter event date (YYYY-MM-DD):");
        if (eventDate) {
            setEventCards([...eventCards, { id: Date.now(), date: new Date(eventDate), name: `Event ${eventCards.length + 1}` }]);
        }
    };

    const openEditModal = (event) => {
        setSelectedEventId(event);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEventId({ ...selectedEventId, [name]: value });
    }

    const saveEventChanges = async () => {
        try {
            const response = await fetch(`/api/events/${selectedEventId.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedEventId),
            });
    

            if (response.ok) {
                setEventCards(eventCards.map(event => event.id === selectedEventId.id ? selectedEventId : event));
                setSelectedEventId(null);
            }
            else {
                console.error('Failed to update event');
            }
        } 
        catch (error) {
            console.error('Error updating event: ', error);
        }
    };

    const removeEventCard = (id) => {
        setEventCards(eventCards.filter(event => event.id !== id));
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const viewMembers = async (eventId) => {
        try {
            const response = await axios.get(`/api/events/${eventId}/members`);
            if (response.ok) {
                setMembersList(response.data);
            }
            else {
                console.error('Failed to fetch members');
                setMembersList([]);
            }
        }
        catch (error) {
            console.error('Error fetching members: ', error);
            setMembersList([]);
        }
        setIsMembersModalOpen(true);
    };

    const handleCloseMembersModal = () => {
        setIsMembersModalOpen(false);
        setMembersList([]);
    }

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
                <a href="/" className="logo">
                    <img src={logo} alt="logo" />
                </a>
               
                <a
                    href="#"
                    className={`dashboard ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => handleTabClick('dashboard')}
                >
                    Events
                </a>
                <a
                    href="#"
                    className={`reports ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => handleTabClick('reports')}
                >
                    Event Reports
                </a>
                <a
                    href="/"
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
                        <h3>Active Events</h3>
                        <button className="add_event" onClick={addEventCard}>Add Event</button>

                        {/* Event Cards */}
                        <div className="event-cards-container">
                            {activeEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    {/*<p>{event.name}</p>*/}
                                    <button onClick={() => openEditModal(event)}>Edit</button>
                                    <button onClick = {() => removeEventCard(event.id)} className="Remove">Remove</button>
                                    <button onClick={() => viewMembers(event.id)}>View Members</button>
                                </div>
                            ))}
                        </div>

                        {/* Edit Modal */}
                        {selectedEventId && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>Edit Event</h3>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={selectedEventId.name}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Description:
                                        <textarea
                                            name="description"
                                            value={selectedEventId.description}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Location:
                                        <input
                                            type="text"
                                            name="location"
                                            value={selectedEventId.location}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <input
                                            type="text"
                                            name="status"
                                            value={selectedEventId.status}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <button onClick={saveEventChanges}>Save Changes</button>
                                    <button onClick={() => setSelectedEventId(null)}>Cancel</button>
                                </div>
                            </div>
                        )}

                        {/* Archive Section */}
                        <div className="archive">
                            <h3>Archived Events</h3>
                            <div className="event-cards-container">
                                {archivedEvents.map((event) => (
                                    <div key={event.id} className="event-card">
                                        <p>Archived Event Date: {event.date.toDateString()}</p>
                                        <button onClick = {() => removeEventCard(event.id)} className="Remove">Remove</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Members Modal */}
                {isMembersModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h3>Members Signed Up for Event</h3>
                            <ul>
                                {membersList.length > 0 ? (
                                    membersList.map(member => (
                                        <li key={member.id}>{member.name}</li>
                                    ))
                                ) : (
                                    <p>No members signed up.</p>
                                )}
                            </ul>
                            <button onClick={handleCloseMembersModal}>Close</button>
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
