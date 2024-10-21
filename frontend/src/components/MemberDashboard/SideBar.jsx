import React from 'react';
import '../../css/MemberDashboard/SideBar.css';  // Importing the CSS for styling the sidebar

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>MFA</h2>
      </div>
      <ul className="menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><a href="/logout" className="logout">Logout</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
