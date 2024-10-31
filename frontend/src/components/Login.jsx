import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, CssBaseline } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import HomeNavBar from '../components/HomeNavBar'; // Move this import to the top
import '../css/Auth.module.css'; // Import the updated CSS
import TicketBackground from '../assets/TicketsBackground.png';

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

        if (Object.keys(newErrors).length > 0) return;

        try {
            const loginUrl = `${process.env.REACT_APP_API_URL}/login`;
            console.log("Login Endpoint URL:", loginUrl);
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

                if (data.role === 'admin') navigate('/');
                else if (data.role === 'staff') navigate('/giftshop-admin');
                else navigate('/');
            } else {
                const data = await response.json();
                setErrors({ server: data.message });
            }
        } catch (error) {
            setErrors({ server: 'Error logging in.' });
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
                {errors.server && <Typography color="error">{errors.server}</Typography>}
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
