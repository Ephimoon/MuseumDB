// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/HomeNavBar.css';
import logo from '../assets/LOGO.png';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [navBackground, setNavBackground] = useState('transparent');

    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

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
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: navBackground }} className="navbar">
            <div className="navbar-container">
                {/* Left Side: Logo and Navigation Links */}
                <div className="left-side">
                    <img onClick={() => navigate('/')} src={logo} alt="MFAH" className="logo" />
                    <ul className="nav-links">
                        <li><a href="/Visit">Visit</a></li>
                        <li><a href="/ExhibitionsAndEvents">Exhibitions and Events</a></li>
                        <li><a href="/Art">Art</a></li>
                        <li><a href="/MFAShop">MFA Shop</a></li>
                        {role === 'admin' && (
                            <li><a href="/giftshop-admin">Manage Gift Shop</a></li>
                        )}
                    </ul>
                </div>

                {/* Right Side: Buttons */}
                <div className="nav-buttons">
                    {role ? (
                        <>
                            <span className="welcome-message">Welcome, {username}!</span>
                            <button onClick={() => navigate('/profile')} className="btn-outline">Profile</button>
                            <button onClick={handleLogout} className="btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <a href="/BecomeAMember" className="becomeamember">Become a Member</a>
                            <button onClick={() => navigate('/BuyTickets')} className="btn-outline">Buy Tickets</button>
                            <button onClick={() => navigate('/login')} className="btn-outline">Login</button>
                            <button onClick={() => navigate('/register')} className="btn-outline">Register</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
