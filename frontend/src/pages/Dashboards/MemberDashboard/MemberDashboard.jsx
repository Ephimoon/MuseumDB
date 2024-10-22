import React from 'react';
import Sidebar from '../../../components/MemberDashboard/SideBar';
import Header from '../../../components/MemberDashboard/Header';
import MainContent from '../../../components/MemberDashboard/MainContent';
import '../../../css/MemberDashboard/MemberDashboard.css'; 



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
