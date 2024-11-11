import React, { useState, useEffect } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import ExhibitionImage from '../assets/exhibitions.png';
import { ExhibitionsCardUser, ExhibitionModalUser } from '../components/ExhibitionsCardUser.jsx'; // Importing both components
import '../css/ExhibitionsAndEvents.css';
import axios from 'axios';

const ExhibitionsAndEvents = () => {

    const exhibitions = [
        {
            id: 1,
            image: "https://placehold.jp/500x500.png",
            name: 'Hockney-Van Gogh: The Joy of Nature',
            date_start: 'Oct 26, 2021',
            date_end: 'Jan 2, 2022',
            description: 'Discover the unexpected resonances between the work of Vincent van Gogh and David Hockney, two artists from different centuries who share a deep connection to nature.'
        },
        {
            id: 2,
            image: "https://placehold.jp/500x500.png",
            name: 'Event name 2',
            date_start: 'Oct 1, 2023',
            date_end: 'Feb 5, 2024',
            description: 'Discover more about this exhibition.'
        },
        {
            id: 3,
            image: "https://placehold.jp/500x500.png",
            name: 'Event name 3',
            date_start: 'Oct 1, 2023',
            date_end: 'Feb 5, 2024',
            description: 'Discover more about this exhibition.'
        },
        /*{
            id: 4,
            image: "https://placehold.jp/500x500.png",
            name: 'Modern Art Exhibition',
            date_start: 'Nov 25, 2021',
            date_end: 'Jan 7, 2022',
            description: 'Explore contemporary artworks from emerging artists around the globe. Features paintings, sculptures, and digital installations.'
        },
        {
            id: 5,
            image: "https://placehold.jp/500x500.png",
            name: 'Renaissance Masters',
            date_start: 'Nov 1, 2023',
            date_end: 'Feb 5, 2024',
            description: 'A curated collection of Renaissance masterpieces, featuring works from Italian and Northern European artists.'
        },
        {
            id: 6,
            image: "https://placehold.jp/500x500.png",
            name: 'Ancient Civilizations',
            date_start: 'June 1, 2023',
            date_end: 'Feb 5, 2024',
            description: 'Journey through time with artifacts from ancient Egypt, Greece, and Rome. Interactive displays and guided tours available.'
        },*/
    ];

    const [event, setSelectedEvent] = useState([]);
    const [selectedExhibition, setSelectedExhibition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch event data
        const fetchEventData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events');
                if (response.status === 200) {
                    const formattedEvents = response.data.map(event => ({
                        id: event.event_id,
                        name: event.name_,
                        image: "https://placehold.jp/500x500.png",
                        date_start: event.start_date,
                        date_end: event.end_date,
                        description: event.description_
                    }));
                    setSelectedEvent(formattedEvents);
                } 
            } catch (error) {
                console.error('Error fetching events: ', error);
            }
        };
        fetchEventData();
    }, []);


    const handleExploreClick = (exhibition) => {
        setSelectedExhibition(exhibition);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div style={{ marginTop: '100px' }}>
            <HomeNavBar />
            <div className="container">
                <img src={ExhibitionImage} alt="Exhibitions" className="HalfBackgroundImage" />
                <div className="overlay">
                    <h1 className="title">Exhibitions & Events</h1>
                </div>
            </div>

            <div className="exhibitions-container">
                {exhibitions.map((exhibition) => (
                    <ExhibitionsCardUser
                        key={exhibition.id}
                        exhibition={exhibition}
                        onExploreClick={handleExploreClick}
                    />
                ))}
                 {event.map((exhibition) => (
                    <ExhibitionsCardUser
                        key={exhibition.id}
                        exhibition={exhibition}
                        onExploreClick={handleExploreClick}
                    />
                ))}
            </div>

            {isModalOpen && (
                <ExhibitionModalUser exhibition={selectedExhibition} onClose={closeModal} />
            )}
        </div>
    );
};

export default ExhibitionsAndEvents;
