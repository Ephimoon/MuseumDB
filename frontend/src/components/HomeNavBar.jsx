import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/HomeNavBar.css';
import logo from '../assets/LOGO.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Get the current route
    const [navBackground, setNavBackground] = useState('transparent');

    // Function to handle the navbar background on scroll
    const handleScroll = () => {
        if (window.scrollY > 50) {
        setNavBackground('#352F36');
        } else {
        setNavBackground('transparent');
        }
    };

    // Add event listener on scroll if on the home page
    useEffect(() => {
        if (location.pathname === '/') {
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        } else {
            setNavBackground('#352F36'); // Set navbar to black for non-home pages
        }
    }, [location.pathname]); // Runs this code every time the route changes

    return (
        <nav style={{ backgroundColor: navBackground }} className="navbar">
            <div className="navbar-container">
                {/* Left Side: Logo and Navigation Links */}
                <div className='left-side'>
                    <img onClick={() => navigate('/')} src={logo} alt="MFAH" className="logo" />
                    <ul className="nav-links">
                        <li><a href="/Visit">Visit</a></li>
                        <li><a href="/ExhibitionsAndEvents">Exhibitions and Events</a></li>
                        <li><a href="/Art">Art</a></li>
                        <li><a href="/MFAShop">MFA Shop</a></li>
                    </ul>
                </div>
                
                {/* Right Side: Buttons */}
                <div className="nav-buttons">
                <a href="/BecomeAMember" className="becomeamember">Member Login</a>
                <a href="/BecomeAMember" className="becomeamember">Become a Member</a>
                <button onClick={() => navigate('/BuyTickets')} className="btn-outline">Buy Tickets</button>
                </div>
            </div>
            </nav>
    );
};

export default Navbar;
