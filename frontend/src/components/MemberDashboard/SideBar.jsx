import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../../css/MemberDashboard/SideBar.css';
import logo from '../../assets/LOGO.png';

const Sidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="logo" onClick={() => navigate('/')}>
                <img src={logo} alt="MFA Logo" style={{ cursor: 'pointer' }} />
            </div>
            <ul className="menu">
                <li><a href="/MemberDashboard">Dashboard</a></li>
                <li><a href="/settings">Settings</a></li>
            </ul>
            <div className='logout'>
                <button onClick={handleLogout} className='logout-button'>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
