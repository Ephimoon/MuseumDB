// src/components/Navbar.jsx

<<<<<<< Updated upstream
import React, {useContext, useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom'; // Using Link for navigation
=======
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
>>>>>>> Stashed changes
import '../css/HomeNavBar.css';
import logo from '../assets/LOGO.png';
import { CartContext } from './CartContext';
import { TicketCartContext } from './TicketCartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Navbar = () => {
    const location = useLocation();
    const { cartItems } = useContext(CartContext);
    const { ticketCartItems } = useContext(TicketCartContext);
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
        navigate('/login');
    };

    const toggleEmployeeMenu = () => {
        setEmployeeMenuOpen(!employeeMenuOpen);
    };

<<<<<<< Updated upstream
=======
    const handleBuyTicketsClick = () => {
        if (!role) {
            // If not logged in, redirect to login page with a redirect state
            navigate('/login', { state: { redirectTo: '/buytickets' } }); // Redirect to BuyTickets after login
            alert('You need to login to buy tickets.');
        } else {
            // If logged in, navigate to the BuyTickets page
            navigate('/buytickets');
        }
    };

>>>>>>> Stashed changes
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

    // Calculate total items in carts
    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalTicketItems = ticketCartItems.reduce((total, item) => total + item.quantity, 0);

    return (
<<<<<<< Updated upstream
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
=======
        <>
            <nav style={{ backgroundColor: navBackground }} className="navbar">
                <div className="navbar-container">
                    {/* Left Side: Logo and Navigation Links */}
                    <div className="left-side">
                        <Link to="/">
                            <img src={logo} alt="MFAH" className="logo" style={{ cursor: 'pointer' }} />
                        </Link>
                        <ul className="nav-links">
                            <li>
                                <Link to="/Visit">Visit</Link>
                            </li>
                            <li>
                                <Link to="/ExhibitionsAndEvents">Exhibitions and Events</Link>
                            </li>
                            <li>
                                <Link to="/Art">Art</Link>
                            </li>
                            <li>
                                <Link to="/MFAShop">MFA Shop</Link>
                            </li>
                            {['admin', 'staff'].includes(role) && (
                                <li className="employee-menu">
                  <span onClick={toggleEmployeeMenu} className="employee-menu-title">
                    For Employee
                      {employeeMenuOpen ? (
                          <ExpandLessIcon className="dropdown-icon" />
                      ) : (
                          <ExpandMoreIcon className="dropdown-icon" />
                      )}
                  </span>
                                    {employeeMenuOpen && (
                                        <ul className="dropdown-menu">
                                            {/* Common menu items for both admin and staff */}
                                            <>
                                                <li>
                                                    <Link to="/giftshop-admin">Manage Gift Shop</Link>
                                                </li>
                                                <li>
                                                    <Link to="/curate-art">Curate Art</Link>
                                                </li>
                                                <li>
                                                    <Link to="/reports">Reports</Link>
                                                </li>
                                                <li>
                                                    <Link to="/eventdirectordash">Manage Events</Link>
                                                </li>
                                                <li>
                                                    <Link to="/curate-exhibitions">Curate Exhibitions</Link>
                                                </li>
                                            </>

                                            {/* Additional menu item exclusively for admin */}
                                            {role === 'admin' && (
                                                <li>
                                                    <Link to="/manage-users">Manage Users</Link>
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Right Side: Buttons and Cart Icons */}
                    <div className="nav-buttons">
                        {role ? (
                            <>
                                <span className="welcome-message">Welcome, {username}!</span>

                                {role.toLowerCase() === 'customer' && (
                                    <Link to="/BecomeAMember" className="becomeamember">
                                        Become a Member
                                    </Link>
                                )}

                                <button onClick={handleBuyTicketsClick} className="btn-outline">
                                    Buy Tickets
                                </button>

                                {/* Conditionally render the Dashboard button for all roles except 'customer' and 'member' */}
                                {role !== 'customer' && role !== 'member' && (
                                    <Link to={getDashboardRoute()} className="btn-outline dashboard-button">
                                        Dashboard
                                    </Link>
                                )}

                                {/* Add My Tickets Link */}
                                <Link to="/mytickets" className="btn-outline">
                                    My Tickets
                                </Link>

                                <Link to="/profile" className="btn-outline">
                                    Profile
                                </Link>
                                <Link to="/login" onClick={handleLogout} className="btn-outline">
                                    Logout
                                </Link>
                            </>
                        ) : (
                            <>
                                <button onClick={handleBuyTicketsClick} className="btn-outline">
                                    Buy Tickets
                                </button>
                                <Link to="/login" className="btn-outline">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-outline">
                                    Register
                                </Link>
                            </>
                        )}
                        {location.pathname !== '/checkout' && (
                            <div className="cart-icons" style={{ display: 'flex', alignItems: 'center' }}>
                                {/* Gift Shop Cart Icon */}
                                <div
                                    className="cart-icon"
                                    style={{ position: 'relative', cursor: 'pointer', marginRight: '10px' }}
                                >
                                    <Link to="/cart">
                                        <ShoppingCartIcon fontSize="large" style={{ color: '#FFFFFF' }} />
                                        {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
                                    </Link>
                                </div>
                                {/* Ticket Cart Icon */}
                                <div className="cart-icon" style={{ position: 'relative', cursor: 'pointer' }}>
                                    <Link to="/ticket-cart">
                                        <ConfirmationNumberIcon fontSize="large" style={{ color: '#FFFFFF' }} />
                                        {totalTicketItems > 0 && <span className="cart-count">{totalTicketItems}</span>}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
>>>>>>> Stashed changes
};

export default Navbar;
