// src/App.jsx

import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Visit from './pages/Visit';
import ExhibitionsAndEvents from './pages/ExhibitionsAndEvents';
import Art from './pages/Art';
import MFAShop from './pages/MFAShop';
import BecomeAMember from './pages/BecomeAMember';
import BuyTickets from './pages/BuyTickets';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import LogoutPage from './pages/LogoutPage';
import StaffDashboard from './pages/Dashboards/StaffDashboard';
import GiftShopAdmin from './components/GiftShopAdmin';
import ManageUsers from './components/ManageUsers';
import EventDirectorDashboard from './pages/Dashboards/EventDashboard';
import EventReport from './pages/Dashboards/EventReport';
import CurateArt from './pages/Dashboards/CurateArt';
import CurateExhibitions from './pages/Dashboards/CurateExhibitions';
import ProfilePage from './pages/ProfilePage';
import MFAShopStaff from './pages/Dashboards/MFAShopStaff';
import ShopReport from './pages/Dashboards/ShopReport';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TicketCart from './pages/TicketCart';
import TicketCheckout from './pages/TicketCheckout';
import MemberDashboard from './pages/Dashboards/MemberDashboard/MemberDashboard';
import Settings from './pages/Dashboards/MemberDashboard/Settings';
import Report from './pages/Report';
import { TicketCartProvider } from './components/TicketCartContext';
import MyTicket from './components/MyTickets';
import MembershipReport from './pages/MembershipReport';
import EmailLogs from './components/EmailLogs';
import TicketsReport from './pages/TicketsReport';

const App = () => {
    const username = localStorage.getItem('username'); // Check if a user is logged in
    const role = localStorage.getItem('role'); // Get user role

    return (
        <BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <TicketCartProvider>
                <Routes>
                    {/* Public Routes - Accessible to all users */}
                    <Route path="/" element={<Home />} />
                    <Route path="/Visit" element={<Visit />} />
                    <Route path="/ExhibitionsAndEvents" element={<ExhibitionsAndEvents />} />
                    <Route path="/Art" element={<Art />} />
                    <Route path="/MFAShop" element={<MFAShop />} />
                    <Route path="/shop" element={<MFAShop />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/BecomeAMember" element={<BecomeAMember />} />
                    <Route path="/BuyTickets" element={<BuyTickets />} />
                    <Route path="/ticket-checkout" element={<TicketCheckout />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify" element={<VerifyPage />} />
                    <Route path="/logout" element={<LogoutPage />} />

                    {/* Member Routes - Accessible to logged-in members */}
                    <Route element={<PrivateRoute roles={['member', 'customer']} />}>
                        <Route path="/MemberDashboard" element={<MemberDashboard />} />
                        <Route path="/Settings" element={<Settings />} />
                    </Route>

                    {/* Admin Routes - Accessible to admin users only */}
                    <Route element={<PrivateRoute roles={['admin']} />}>
                        <Route path="/AdminDashboard" element={<AdminDashboard />} />
                        <Route path="/manage-users" element={<ManageUsers />} />
                        <Route path="/giftshop-admin" element={<GiftShopAdmin />} />
                    </Route>

                    {/* Staff and Admin Dashboard Routes */}
                    <Route element={<PrivateRoute roles={['admin', 'staff']} />}>
                        <Route path="/StaffDashboard" element={<StaffDashboard />} />
                        <Route path="/EventDirectorDash" element={<EventDirectorDashboard />} />
                        <Route path="/event-report" element={<EventReport />} />
                        <Route path="/curate-art" element={<CurateArt />} />
                        <Route path="/curate-exhibitions" element={<CurateExhibitions />} />
                        <Route path="/MFAShopStaff" element={<MFAShopStaff />} />
                        <Route path="/shop-report" element={<ShopReport />} />
                        <Route path="/reports" element={<Report />} />
                        <Route path="/ticket-report" element={<TicketsReport />} />
                        <Route path="/membership-report" element={<MembershipReport />} />
                        <Route path="/email-logs" element={<EmailLogs />} />
                    </Route>

                    {/* Profile Page - Accessible to all logged-in users */}
                    <Route element={<PrivateRoute roles={['admin', 'staff', 'customer', 'member']} />}>
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/ticket-cart" element={<TicketCart />} />
                        <Route path="/mytickets" element={<MyTicket />} />
                    </Route>

                    {/* Redirect unknown routes to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </TicketCartProvider>
        </BrowserRouter>
    );
};

export default App;
