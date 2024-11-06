// src/pages/Dashboard/StaffDashboard.jsx

import React from 'react';
import HomeNavBar from '../../components/HomeNavBar';
import AnnouncementDisplay from '../../components/AnnouncementDisplay';

const StaffDashboard = () => {
    return (
        <div>
            <HomeNavBar />
            <div style={{ paddingTop: '80px' }}>
                <AnnouncementDisplay />
            </div>
        </div>
    );
};

export default StaffDashboard;
