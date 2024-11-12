import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Visit from './pages/Visit';
import ExhibitionsAndEvents from './pages/ExhibitionsAndEvents';
import Art from './pages/Art';
import MFAShop from './pages/MFAShop';
import BecomeAMember from './pages/BecomeAMember';
import BuyTickets from './pages/BuyTickets';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import LogoutPage from './pages/LogoutPage';
import StaffDashboard from './pages/Dashboards/StaffDashboard';
import GiftShopAdmin from './components/GiftShopAdmin';
import EventDirectorDashboard from './pages/Dashboards/EventDashboard';
import EventReport from './pages/Dashboards/EventReport';
import CurateArt from './pages/Dashboards/CurateArt';
import CurateExhibitions from './pages/Dashboards/CurateExhibitions';
import ProfilePage from './pages/ProfilePage';
import MFAShopStaff from './pages/Dashboards/MFAShopStaff';
import ShopReport from './pages/Dashboards/ShopReport';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MemberDashboard from './pages/Dashboards/MemberDashboard/MemberDashboard';
import Settings from './pages/Dashboards/MemberDashboard/Settings';
import Report from './pages/Report';
import TicketCheckout from './pages/TicketCheckout';
import { TicketCartProvider } from './components/TicketCartContext';
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
// Manage Users
import ManageUsers from '../src/components/ManageUsers';
const App = () => {
    const isAuthenticated = Boolean(localStorage.getItem('username')); // Check if a user is logged in

    return (
        <BrowserRouter>
            <ToastContainer />
            <TicketCartProvider> {/* Wrapping Routes with TicketCartProvider */}
                <Routes>
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

                    {/* Member Routes */}
                    <Route element={<PrivateRoute roles={['customer', 'member']} />}>
                        <Route path="/MemberDashboard" element={<MemberDashboard />} />
                        <Route path="/Settings" element={<Settings />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<PrivateRoute roles={['admin']} />}>
                        <Route path="/AdminDashBoard" element={<AdminDashboard />} />
                        <Route path="/manage-users" element={<ManageUsers />} />

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
                        <Route path="/giftshop-admin" element={<GiftShopAdmin />} />
                    </Route>

                    {/* Profile Page */}
                    <Route element={<PrivateRoute roles={['admin', 'staff', 'customer', 'member']} />}>
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Routes>
            </TicketCartProvider>
        </BrowserRouter>
    );
};

export default App;
