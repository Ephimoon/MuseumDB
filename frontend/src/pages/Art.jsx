import React from 'react'
import HomeNavBar from '../components/HomeNavBar'

const Art = () => {
    return (
        <div style={{ marginTop: '100px' }}> {/* Adjust the margin to match the navbar height */}
            <HomeNavBar />
            {/* fill any way you want */}
            <h1>Art</h1> {/* test, u can delete */}
        </div>
    );
};
  
export default Art;
