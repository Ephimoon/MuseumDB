import React from 'react';
import '../../css/MemberDashboard/Settings.css'

const Settings = () => {
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-options">
        <ul>
          <li>Edit Profile</li>
          <li>Cancel Membership</li>
          <li>Delete Account</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
