// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Button, Container, CssBaseline, TextField, Typography
} from '@mui/material';
import HomeNavBar from '../components/HomeNavBar';
import TicketBackground from '../assets/TicketsBackground.png';
import '../css/ProfilePage.css';
import dayjs from 'dayjs';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        username: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    useEffect(() => {
        axios
            .get(`http://localhost:5000/users/${userId}`, {
                headers: { 'user-id': userId, role },
            })
            .then((response) => {
                const data = response.data;
                setUserData({
                    ...data,
                    dateOfBirth: dayjs(data.dateOfBirth).format('YYYY-MM-DD'),
                });
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
                toast.error('Error fetching user data.');
            });
    }, [userId, role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!userData.firstName) newErrors.firstName = 'First name is required';
        if (!userData.lastName) newErrors.lastName = 'Last name is required';
        if (!userData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!userData.email) newErrors.email = 'Email is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach((error) => toast.error(error));
            return;
        }

        axios
            .put(`http://localhost:5000/users/${userId}`, userData, {
                headers: { 'user-id': userId, role },
            })
            .then(() => {
                toast.success('Profile updated successfully!');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
                toast.error('Error updating profile.');
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
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={userData.username}
                            InputProps={{ readOnly: true }}
                            className="read-only-input"
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
                            error={!!errors.firstName}
                            helperText={errors.firstName}
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
                            error={!!errors.lastName}
                            helperText={errors.lastName}
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
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth}
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
                            error={!!errors.email}
                            helperText={errors.email}
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
