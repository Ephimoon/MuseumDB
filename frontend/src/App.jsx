import React from 'react'
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Home from './pages/Home';
import Visit from './pages/Visit';
import ExhibitionsAndEvents from './pages/ExhibitionsAndEvents';
import Art from './pages/Art';
import MFAShop from './pages/MFAShop';
import BecomeAMember from './pages/BecomeAMember';
import BuyTickets from './pages/BuyTickets';

import AdminDashboard from './pages/Dashboards/AdminDashboard';
import AdminReport from './pages/Dashboards/AdminReport';

import StaffDashboard from './pages/Dashboards/StaffDashboard';

import EventDirectorDashboard from './pages/Dashboards/EventDashboard';
import EventReport from './pages/Dashboards/EventReport';

import CurateArt from './pages/Dashboards/CurateArt';
import CurateExhibitions from './pages/Dashboards/CurateExhibitions';

import MFAShopStaff from './pages/Dashboards/MFAShopStaff';
import ShopReport from './pages/Dashboards/ShopReport';

import MemberDashboard from './pages/Dashboards/MemberDashboard/MemberDashboard';
import Settings from './pages/Dashboards/MemberDashboard/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* PAGES ANY USER CAN VIEW (LOGGED OUT) */}
        <Route path='/' element={<Home />} />
        <Route path='/Visit' element={<Visit />} />
        <Route path='/ExhibitionsAndEvents' element={<ExhibitionsAndEvents />} />
        <Route path='/Art' element={<Art />} />
        <Route path='/MFAShop' element={<MFAShop />} />
        {/* add any additional pages, probably will for mfa shop */}
        <Route path='/BecomeAMember' element={<BecomeAMember />} />
        <Route path='/BuyTickets' element={<BuyTickets />} />

        {/* EMPLOYEE DASHBOARDS */}
        <Route path='/AdminDashboard' element={<AdminDashboard/>} /> // will display employees
        <Route path='/admin-report' element={<AdminReport/>} />

        <Route path='/StaffDashboard' element={<StaffDashboard/>} />

        <Route path='/EventDirectorDash' element={<EventDirectorDashboard/>} /> // prob change name to EventDirector ?? idk
        <Route path='/event-report' element={<EventReport/>} />

        <Route path='/curate-art' element={<CurateArt/>} />
        <Route path='/curate-exhibitions' element={<CurateExhibitions/>} />

        <Route path='/MFAShopStaff' element={<MFAShopStaff/>} />
        <Route path='/shop-report' element={<ShopReport/>} />

        {/* MEMBER DASHBOARD */}
        <Route path='/MemberDashboard' element={<MemberDashboard/>} />
        <Route path='/Settings' element={<Settings/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App

