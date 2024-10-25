import React, { useState } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import ExhibitionImage from '../assets/exhibitions.png';
import { ExhibitionsCardUser, ExhibitionModalUser } from '../components/ExhibitionsCardUser.jsx'; // Importing both components
import '../css/ExhibitionsAndEvents.css';

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
    ];

    const [selectedExhibition, setSelectedExhibition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <h1 className="title">Exhibitions</h1>
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
            </div>

            {isModalOpen && (
                <ExhibitionModalUser exhibition={selectedExhibition} onClose={closeModal} />
            )}
        </div>
    );
};

export default ExhibitionsAndEvents;
