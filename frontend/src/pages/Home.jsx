import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import HomeImage from '../assets/home.png';
import HomeCard from '../components/HomeCard';
import '../css/Home.css'; // Import your CSS file

const Home = () => {
    const navigate = useNavigate();
    return (
        <div>
            <HomeNavBar />
            {/* Background Image */}
            <img src={HomeImage} alt="MFAH Landing Page Image" className="HomeBackgroundImage" />
            
            {/* Overlayed content */}
            <div className="home-content">
                <h1 className="heading-title">The Museum of Fine Arts, Houston</h1>
                <button onClick={() => navigate('/Visit')} className="btn">Plan your visit</button>
            </div>

            {/* after the image */}
            <div className='bottom-background'>
                {/* exhibition card */}
                <HomeCard/>

                {/* event card */}
                <HomeCard/>
            </div>
        </div>
    );
};

export default Home;
