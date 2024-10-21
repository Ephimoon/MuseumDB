import React from 'react';
import Sidebar from '../../components/MemberDashboard/SideBar';
import '../../css/MemberDashboard/MemberDashboard.css'; // Custom CSS for the Member Dashboard page



const MemberDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-section">
        <Header />
        <MainContent />
      </div>
    </div>
  );
};

export default MemberDashboard;
