import React from 'react'
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Home from './pages/Home';
import Visit from './pages/Visit';
import ExhibitionsAndEvents from './pages/ExhibitionsAndEvents';
import Art from './pages/Art';
import MFAShop from './pages/MFAShop';
import BecomeAMember from './pages/BecomeAMember';
import BuyTickets from './pages/BuyTickets';
import EventDirectorDashboard from './pages/Dashboards/EventDashboard';
import MemberDashboard from './pages/Dashboards/MemberDashboard';

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
        <Route path='/EventDirectorDash' element={<EventDirectorDashboard/>} />
        <Route path='/MemberDashboard' element={<MemberDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

