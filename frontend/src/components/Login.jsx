// src/pages/Login.jsx

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, CssBaseline } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import HomeNavBar from '../components/HomeNavBar';
import '../css/Auth.module.css';
import TicketBackground from '../assets/TicketsBackground.png';
import { toast } from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Display validation errors using toast
            Object.values(newErrors).forEach((error) => toast.error(error));
            return;
        }

        try {
            const loginUrl = `http://localhost:5000/login`;
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('role', data.role);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('username', username);

                toast.success('Login successful!');
                // Redirect based on role
                if (data.role === 'admin') navigate('/AdminDashBoard'); // Adjust route as needed
                else if (data.role === 'staff') navigate('/StaffDashboard');
                else if (data.role === 'customer') navigate('/'); // Or any other customer-specific page
                else if (data.role === 'member') navigate('/MemberDashboard');
                else navigate('/'); // Default route
            } else {
                // Always show a generic error message
                const errorData = await response.json();
                toast.error(errorData.message || 'Incorrect username or password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            toast.error('Error logging in.');
        }
    };

    return (
        <div
            className="tickets-container"
            style={{
                backgroundImage: `linear-gradient(rgba(220, 74, 56, 0.2), rgba(220, 74, 56, 0.2)), url(${TicketBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <HomeNavBar />
            <div className="tickets-content">
                <CssBaseline />
                <Typography component="h1" variant="h5" className="tickets-title">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        error={!!errors.username}
                        helperText={errors.username}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="purchase-button"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </Typography>
                </Box>
            </div>
        </div>
    );
};

export default Login;
