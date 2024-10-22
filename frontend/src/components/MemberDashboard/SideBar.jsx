import React from 'react';
import '../../css/MemberDashboard/SideBar.css';  
import logo from '../../assets/LOGO.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt='MFA Logo' />
      </div>
      <ul className="menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
      <div className='logout'>
        <a href='logout'>Logout</a>
      </div>
    </div>
  );
};

export default Sidebar;
