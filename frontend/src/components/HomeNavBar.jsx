// src/components/Navbar.jsx

import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom'; // Using Link for navigation
import '../css/HomeNavBar.css';
import logo from '../assets/LOGO.png';
import {CartContext} from './CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Navbar = () => {
    const location = useLocation();
    const {cartItems} = useContext(CartContext);
    const [navBackground, setNavBackground] = useState('transparent');
    const [employeeMenuOpen, setEmployeeMenuOpen] = useState(false);

    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const handleScroll = () => {
        setNavBackground(window.scrollY > 50 ? '#352F36' : 'transparent');
    };

    useEffect(() => {
        if (location.pathname === '/') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            setNavBackground('#352F36');
        }
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
    };

    const toggleEmployeeMenu = () => {
        setEmployeeMenuOpen(!employeeMenuOpen);
    };

    const getDashboardRoute = () => {
        switch (role) {
            case 'admin':
                return '/AdminDashBoard';
            case 'staff':
                return '/StaffDashBoard';
            case 'member':
                return '/MemberDashBoard';
            case 'customer':
                return '/CustomerDashBoard'; // Assuming you have a customer dashboard
            default:
                return '/';
        }
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
                        {(role === 'admin' || role === 'staff') && (
                            <li><a href="/curate-art">Curate Art</a></li>
                        )}
                    </ul>
                </div>
    return (<nav style={{backgroundColor: navBackground}} className="navbar">
        <div className="navbar-container">
            {/* Left Side: Logo and Navigation Links */}
            <div className="left-side">
                <Link to="/">
                    <img src={logo} alt="MFAH" className="logo" style={{cursor: 'pointer'}}/>
                </Link>
                <ul className="nav-links">
                    <li><Link to="/Visit">Visit</Link></li>
                    <li><Link to="/ExhibitionsAndEvents">Exhibitions and Events</Link></li>
                    <li><Link to="/Art">Art</Link></li>
                    <li><Link to="/MFAShop">MFA Shop</Link></li>
                    {(['admin', 'staff'].includes(role)) && (<li className="employee-menu">
                    <span onClick={toggleEmployeeMenu} className="employee-menu-title">
                     For Employee
                        {employeeMenuOpen ? <ExpandLessIcon className="dropdown-icon"/> :
                            <ExpandMoreIcon className="dropdown-icon"/>}
                     </span>
                        {employeeMenuOpen && (<ul className="dropdown-menu">
                            {role === 'admin' && (<>
                                <li><Link to="/giftshop-admin">Manage Gift Shop</Link></li>
                                <li><Link to="/manage-users">Manage Users</Link></li>
                                {/* New Menu Item */}
                            </>)}
                            <li><Link to="/reports">Reports</Link></li>
                        </ul>)}
                    </li>)}

                </ul>
            </div>

            {/* Right Side: Buttons and Cart Icon */}
            <div className="nav-buttons">
                {role ? (<>
                    <span className="welcome-message">Welcome, {username}!</span>
                    <Link to={getDashboardRoute()} className="btn-outline dashboard-button">
                        Dashboard
                    </Link>
                    <Link to="/profile" className="btn-outline">Profile</Link>
                    {/* Dashboard Button */}
                    <Link to="/login" onClick={handleLogout} className="btn-outline">Logout</Link>
                </>) : (<>
                    <Link to="/BecomeAMember" className="becomeamember">Become a Member</Link>
                    <Link to="/BuyTickets" className="btn-outline">Buy Tickets</Link>
                    <Link to="/login" className="btn-outline">Login</Link>
                    <Link to="/register" className="btn-outline">Register</Link>
                </>)}
                {location.pathname !== '/checkout' && (
                    <div className="cart-icon" style={{position: 'relative', cursor: 'pointer'}}>
                        <Link to="/cart">
                            <ShoppingCartIcon fontSize="large" style={{color: '#FFFFFF'}}/>
                            {cartItems.length > 0 && (<span className="cart-count">{cartItems.length}</span>)}
                        </Link>
                    </div>)}
            </div>
        </div>
    </nav>);
};

export default Navbar;
