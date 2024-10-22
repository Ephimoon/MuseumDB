import React from 'react';
import '../../css/MemberDashboard/Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="member-info">
        <span>Member Name</span>
      </div>
      <div className="cart">
        <button>Cart</button>
      </div>
    </div>
  );
};

export default Header;
