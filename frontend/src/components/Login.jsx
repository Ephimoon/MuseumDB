import React, { useState } from 'react';
import { Container, Box, Button, TextField, Typography, CssBaseline, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import HomeNavBar from '../components/HomeNavBar'; // Import HomeNavBar
import '../css/Auth.module.css'; // Use consistent CSS

export default function Login() {
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
            const response = await fetch('http://localhost:5000/login', {
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
        <>
            <HomeNavBar /> {/* Add HomeNavBar */}
            <Container component="main" maxWidth="xs" className="container">
                <CssBaseline />
                <Box sx={{ mt: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" className="h5">Login</Typography>
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
                        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                            Login
                        </Button>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
