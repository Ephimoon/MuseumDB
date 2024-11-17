import React, { useState, useEffect } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import ExhibitionImage from '../assets/exhibitions.png';
import { ExhibitionsCardUser, ExhibitionModalUser, EventCardUser, EventModalUser } from '../components/ExhibitionsCardUser.jsx';
import styles from '../css/ExhibitionsAndEvents.module.css';
import axios from 'axios';

const ExhibitionsAndEvents = () => {
    const [exhibitions, setExhibitions] = useState([]); // Changed to exhibitions
    const [events, setEvents] = useState([]); // Changed to events
    const [selectedExhibition, setSelectedExhibition] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null); // Renamed for clarity
    const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [exhibitionImages, setExhibitionImages] = useState({});

    const fetchAllExhibitionImages = async () => {
        const images = {};
        await Promise.all(
            exhibitions.map(async (exhibition) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/exhibition/${exhibition.exhibition_id}/image`, {
                        responseType: 'blob',
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    images[exhibition.exhibition_id] = imageUrl;
                } catch (error) {
                    console.error(`Error fetching image for exhibition ${exhibition.exhibition_id}:`, error);
                }
            })
        );
        setExhibitionImages(images);
    };

    useEffect(() => {
        const fetchExhibitions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/exhibition?isDeleted=false`);
                console.log("Fetched Exhibitions Data (Raw):", response.data);
    
                // Flatten the nested arrays in response.data
                const flattenedExhibitions = response.data.flat(); // Flatten the array
    
                // Filter valid exhibitions after flattening
                const validExhibitions = Array.isArray(flattenedExhibitions)
                    ? flattenedExhibitions.filter(exhibition => exhibition.exhibition_id)
                    : [];
    
                console.log("Flattened and Filtered Exhibitions Data:", validExhibitions);
                setExhibitions(validExhibitions);
            } catch (error) {
                console.error('Error fetching exhibitions:', error.response || error.message || error);
            }
        };

        const fetchEventData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events`);
                if (response.status === 200) {
                    const formattedEvents = response.data.map(event => ({
                        id: event.event_id,
                        name: event.name_,
                        date_start: event.start_date,
                        date_end: event.end_date,
                        description: event.description_
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchExhibitions();
        fetchEventData();
    }, []);

    useEffect(() => {
        if (exhibitions.length > 0) {
            fetchAllExhibitionImages();
        }
    }, [exhibitions]);

    const handleExhibitionExploreClick = (exhibition) => {
        setSelectedExhibition(exhibition);
        setIsExhibitionModalOpen(true);
    };

    const handleEventExploreClick = (event) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const closeExhibitionModal = () => {
        setIsExhibitionModalOpen(false);
    };

    const closeEventModal = () => {
        setIsEventModalOpen(false);
    };

    // Filter exhibitions and events to exclude those with an end date in the past
    const today = new Date();
    const filteredExhibitions = exhibitions.filter((exhibition) => new Date(exhibition.end_date) >= today);
    const filteredEvents = events.filter((event) => new Date(event.date_end) >= today);

    return (
        <div style={{ marginTop: '100px' }}>
            <HomeNavBar />
            <div className={styles.container}>
                <img src={ExhibitionImage} alt="Exhibition" className={styles.HalfBackgroundImage} />
                <div className={styles.overlay}>
                    <h1 className={styles.title}>Exhibitions & Events</h1>
                </div>
            </div>

            <div className={styles.exhibitions_container}>
                <h1>Exhibitions</h1>
                <div>
                    {filteredExhibitions.map((exhibition) => (
                        <div key={exhibition.exhibition_id}>
                            <ExhibitionsCardUser
                                exhibition={{
                                    ...exhibition,
                                    image: exhibitionImages[exhibition.exhibition_id], // Pass the image URL
                                }}
                                onExploreClick={handleExhibitionExploreClick}
                            />
                        </div>
                    ))}
                </div>
                <h1>Events</h1>
                <div>
                    {filteredEvents.map((event) => (
                        <div key={event.id}>
                            <EventCardUser
                                event={event}
                                onExploreClick={handleEventExploreClick}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {isExhibitionModalOpen && selectedExhibition && (
                <ExhibitionModalUser exhibition={selectedExhibition} onClose={closeExhibitionModal} />
            )}
            {isEventModalOpen && selectedEvent && (
                <EventModalUser event={selectedEvent} onClose={closeEventModal} />
            )}
        </div>
    );
};

export default ExhibitionsAndEvents;
