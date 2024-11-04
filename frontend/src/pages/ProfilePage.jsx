import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Container, CssBaseline, TextField, Typography
} from '@mui/material';
import HomeNavBar from '../components/HomeNavBar';
import TicketBackground from '../assets/TicketsBackground.png';
import '../css/ProfilePage.css'; // Import updated CSS file
import dayjs from "dayjs";
import ChangePasswordModal from '../components/ChangePasswordModal'; // Import the new modal

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        username: '',
        email: '',
    });
    const [message, setMessage] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // State to control modal

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    useEffect(() => {
        axios.get(`http://localhost:5000/users/${userId}`, {
            headers: { 'user-id': userId, role },
        })
            .then(response => {
                const data = response.data;
                setUserData({
                    ...data,
                    dateOfBirth: dayjs(data.dateOfBirth).format('YYYY-MM-DD'),
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setMessage('Error fetching user data.');
            });
    }, [userId, role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:5000/users/${userId}`, userData, {
            headers: { 'user-id': userId, role },
        })
            .then(response => setMessage('Profile updated successfully!'))
            .catch(error => {
                console.error('Error updating profile:', error);
                setMessage('Error updating profile.');
            });
    };

    const handleOpenPasswordModal = () => {
        setIsPasswordModalOpen(true);
    };

    const handleClosePasswordModal = () => {
        setIsPasswordModalOpen(false);
    };

    return (
        <div
            className="auth-container"
            style={{
                backgroundImage: `url(${TicketBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <HomeNavBar />
            <Container component="main" maxWidth="xs" className="auth-content">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '24px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <Typography component="h1" variant="h5" className="auth-title">
                        Your Profile
                    </Typography>
                    {message && <Typography color="success" sx={{ mt: 2 }}>{message}</Typography>}
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={userData.username}
                            InputProps={{ readOnly: true }}
                            className="read-only-input" // Apply gray style to read-only field
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                            name="dateOfBirth"
                            value={userData.dateOfBirth}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            className="auth-button"
                        >
                            Update Profile
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onClick={handleOpenPasswordModal}
                            sx={{ mb: 2 }}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>
            </Container>

            {/* Change Password Modal */}
            <ChangePasswordModal
                open={isPasswordModalOpen}
                onClose={handleClosePasswordModal}
                userId={userId}
                role={role}
            />
        </div>
    );

};

export default ProfilePage;
