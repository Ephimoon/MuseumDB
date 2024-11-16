import React, { useState, useEffect } from 'react';
import '../../css/event_director.css';
import logo from '../../assets/LOGO.png';
import axios from 'axios';

const EventDirectorDashboard = () => {
    const [eventCards, setEventCards] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userName, setUserName] = useState('User');
    const [selectedEventId, setSelectedEventId] = useState('');
    const [reportData, setReportData] = useState([]); // State to store report data
    const [membersList, setMembersList] = useState([]); // State to store members list
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false); // State to control members modal
    const [isEventModalOpen, setIsEventModalOpen] = useState(false); // State to control event modal
    const [selectedEvent, setSelectedEvent] = useState({ id: '', name: '', description: '', location: '', status: 'upcoming', start_date: '', end_date: ''}); // State to store selected event for editing
    const [filters, setFilters] = useState({minRevenue: '', maxRevenue: '', minMembers: '', maxMembers: ''}); // State to store filters

    useEffect(() => {
        // Fetch event data
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/events`);
                if (response.status === 200) {
                    const formattedEvents = response.data.map(event => ({
                        id: event.event_id,
                        name: event.name_,
                        description: event.description_,
                        location: event.location,
                        status: event.status,
                        start_date: event.start_date,
                        end_date: event.end_date
                    }));
                    setEventCards(formattedEvents);
                }
            } catch (error) {
                console.error('Error fetching events: ', error);
            }
        };
        fetchEventData();
    }, []);

    const addEventCard = () => {
        setSelectedEvent({ id: '', name: '', description: '', location: '', status: 'upcoming', start_date: '', end_date: '' });
        setIsEventModalOpen(true);
    };

    const openEditModal = (event) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEvent({ ...selectedEvent, [name]: value });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    }

    const saveEventChanges = async () => {
        try {
            if (selectedEvent.id) {
                // Update existing event
                //const response = await axios.put(`http://${process.env.REACT_APP_API_URL}/api/events/${selectedEvent.id}`, selectedEvent);
                const response = await axios.put(`http://localhost:5000/api/events/${selectedEvent.id}`, selectedEvent);
                if (response.status === 200) {
                    setEventCards(eventCards.map(event => event.id === selectedEvent.id ? selectedEvent : event));
                } else {
                    console.error('Failed to update event');
                }
            } else {
                // Add new event
                //const response = await axios.post('http://${process.env.REACT_APP_API_URL}/api/events', selectedEvent);
                const response = await axios.post(`http://localhost:5000/api/events`, selectedEvent);
                if (response.status === 200) {
                    setEventCards([...eventCards, { ...selectedEvent, id: response.data.id }]);
                } else {
                    console.error('Failed to add event');
                }
            }
            setSelectedEvent({ id: '', name: '', description: '', location: '', status: 'upcoming', start_date: '', end_date: '' });
            setIsEventModalOpen(false);
        } catch (error) {
            console.error('Error saving event: ', error);
        }
    };

    const removeEventCard = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/events/${id}`); // replace with http://${process.env.REACT_APP_API_URL}/api/events/${id}
            if (response.status === 200) {
                setEventCards(eventCards.filter(event => event.id !== id));
            }
            else {
                console.error('Failed to delete event');
            }
        }
        catch (error) {
            console.error('Error deleting event: ', error);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const viewMembers = async (eventId) => {
        try {
            //const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${eventId}/members`);
            const response = await axios.get(`http://localhost:5000/api/events/${eventId}/members`);
            if (response.status === 200) {
                console.log('Members: ', response.data);
                setMembersList(response.data);
            } else {
                console.error('Failed to fetch members');
                setMembersList([]);
            }
        } catch (error) {
            console.error('Error fetching members: ', error);
            setMembersList([]);
        } finally {
            setIsMembersModalOpen(true);
        }
    };

    const handleCloseMembersModal = () => {
        setIsMembersModalOpen(false);
        setMembersList([]);
    };

    // Handle event selection for reports
    const handleEventSelection = (e) => {
        setSelectedEventId(e.target.value);
    };

    // Fetch report data for all events or a specific event
    const fetchReport = async () => {
        console.log('Fetching report for all events');

        // Reset report data before fetching new report
        setReportData([]);

        try {
            const response = await axios.get(`http://localhost:5000/api/events/report`, { params: filters });
            if (response.status === 200) {
                console.log('Report data:', response.data);
                setReportData(response.data);
            } else {
                console.error('Failed to fetch report data');
                setReportData([]);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
            setReportData([]);
        }
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
                            {eventCards.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className='event-name'>
                                        <p>{event.name}</p>
                                    </div>
                                    <button onClick={() => openEditModal(event)}>Edit</button>
                                    <button onClick={() => removeEventCard(event.id)} className="Remove">Remove</button>
                                    <button onClick={() => viewMembers(event.id)}>View Members</button>
                                </div>
                            ))}
                        </div>

                        {/* Event Modal */}
                        {isEventModalOpen && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>{selectedEvent.id ? 'Edit Event' : 'Add Event'}</h3>
                                    <label>
                                        Name:
                                        <input
                                            type="text"
                                            name="name"
                                            value={selectedEvent.name || ''}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Description:
                                        <textarea
                                            name="description"
                                            value={selectedEvent.description || ''}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Location:
                                        <input
                                            type="text"
                                            name="location"
                                            value={selectedEvent.location || ''}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Status:
                                        <input
                                            type="text"
                                            name="status"
                                            value={selectedEvent.status || ''}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        Start Date:
                                        <input
                                            type="date"
                                            name="start_date"
                                            value={selectedEvent.start_date || ''}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <label>
                                        End Date:
                                        <input
                                            type="date"
                                            name="end_date"
                                            value={selectedEvent.end_date || ''}
                                            onChange={handleInputChange}
                                        />
                                    </label>
                                    <button onClick={saveEventChanges}>{selectedEvent.id ? 'Save Changes' : 'Submit'}</button>
                                    <button onClick={() => setIsEventModalOpen(false)}>Cancel</button>
                                </div>
                            </div>
                        )}
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
                                        <li key={member.id}>{member.fname} {member.lname}</li>
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
                        
                       {/* Filters */}
                       <div className="filters">
                            <label>
                                Min Revenue:
                                <input
                                    type="number"
                                    name="minRevenue"
                                    value={filters.minRevenue}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                Max Revenue:
                                <input
                                    type="number"
                                    name="maxRevenue"
                                    value={filters.maxRevenue}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                Min Members:
                                <input
                                    type="number"
                                    name="minMembers"
                                    value={filters.minMembers}
                                    onChange={handleFilterChange}
                                />
                            </label>
                            <label>
                                Max Members:
                                <input
                                    type="number"
                                    name="maxMembers"
                                    value={filters.maxMembers}
                                    onChange={handleFilterChange}
                                />
                            </label>
                        </div>

                        {/* Button to generate the report */}
                        <button onClick={fetchReport}>Generate Report</button>

                        {/* Display the report */}
                        {reportData.length > 0 && (
                            <div className="report">
                                <h4>Report for Events:</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Event Name</th>
                                            <th>Total Members Signed Up</th>
                                            <th>Total Revenue Generated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.map((data, index) => (
                                            <tr key={index}>
                                                <td>{data.eventName || 'N/A'}</td>
                                                <td>{data.totalMembersSignedUp}</td>
                                                <td>${data.totalRevenue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDirectorDashboard;
