// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Grid,
    Snackbar,
    Alert
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
    const [membershipInfo, setMembershipInfo] = useState(null);
    const [canceling, setCanceling] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    useEffect(() => {
        // Fetch user data
        axios
            .get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
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

        // Fetch membership info if user is a member
        if (role === 'member') {
            axios
                .get(`${process.env.REACT_APP_API_URL}/get-membership-info`, {
                    headers: { 'user-id': userId, role },
                })
                .then((response) => {
                    const data = response.data;
                    setMembershipInfo(data.membership);
                })
                .catch((error) => {
                    console.error('Error fetching membership info:', error);
                    toast.error('Error fetching membership info.');
                });
        }
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
            .put(`${process.env.REACT_APP_API_URL}/users/${userId}`, userData, {
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

    const handleCancelMembership = () => {
        setCanceling(true);
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/cancel-membership`,
                {},
                {
                    headers: { 'user-id': userId, role },
                }
            )
            .then(() => {
                localStorage.setItem('role', 'customer');
                setUserData((prevData) => ({ ...prevData })); // To trigger re-render if needed
                setMembershipInfo(null);
                setSnackbar({
                    open: true,
                    message: 'Membership canceled successfully',
                    severity: 'success',
                });
                setCanceling(false);
            })
            .catch((error) => {
                console.error('Error canceling membership:', error);
                setSnackbar({
                    open: true,
                    message: 'Error canceling membership',
                    severity: 'error',
                });
                setCanceling(false);
            });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ open: false, message: '', severity: 'success' });
    };

    // Helper function to capitalize the first letter
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                flexDirection: 'column',
            }}
        >
            <HomeNavBar />
            <Container component="main" maxWidth="md" className="auth-content">
                <CssBaseline />
                <Grid container spacing={4}>
                    {/* Left Side - Profile Update Form */}
                    <Grid
                        item
                        xs={12}
                        md={membershipInfo ? 6 : 12}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                marginTop: 15,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                width: '100%',
                            }}
                        >
                            <Typography component="h1" variant="h5" className="auth-title">
                                Your Profile
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{ mt: 2 }}
                            >
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
                    </Grid>

                    {/* Right Side - Membership Information */}
                    {membershipInfo && role === 'member' && (
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
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
                                    width: '100%',
                                }}
                            >
                                <Typography component="h1" variant="h5" className="auth-title">
                                    Membership Information
                                </Typography>
                                <Box sx={{ mt: 2, width: '100%' }}>
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="membershipType"
                                        label="Membership Type"
                                        name="membershipType"
                                        value={capitalizeFirstLetter(membershipInfo.type_of_membership)}
                                        InputProps={{ readOnly: true }}
                                        className="read-only-input"
                                    />
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="membershipPrice"
                                        label="Membership Price"
                                        name="membershipPrice"
                                        value={`$${membershipInfo.membership_price}`}
                                        InputProps={{ readOnly: true }}
                                        className="read-only-input"
                                    />
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="expireDate"
                                        label="Expiration Date"
                                        name="expireDate"
                                        value={dayjs(membershipInfo.expire_date).format('YYYY-MM-DD')}
                                        InputProps={{ readOnly: true }}
                                        className="read-only-input"
                                    />
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCancelMembership}
                                        sx={{ mt: 3, mb: 2 }}
                                        disabled={canceling}
                                    >
                                        {canceling ? 'Canceling...' : 'Cancel Membership'}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>

            {/* Change Password Modal */}
            <ChangePasswordModal
                open={isPasswordModalOpen}
                onClose={handleClosePasswordModal}
                userId={userId}
                role={role}
            />

            {/* Snackbar Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );

};

export default ProfilePage;
