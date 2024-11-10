import React from 'react';
import '../../../css/MemberDashboard/Settings.css'
import Sidebar from '../../../components/MemberDashboard/SideBar';
import Header from '../../../components/MemberDashboard/Header';

const Settings = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />  
      <div className="header-container">
        <Header />
        <div className="settings-container">
          <h2>Settings</h2>
            <div className='settings-options'>
              <ul>
                <li>Edit Profile</li>
                <li>Cancel Membership</li>
                <li>Delete Account</li>
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
