import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, CssBaseline, Alert, Snackbar } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import HomeNavBar from '../components/HomeNavBar';
import '../css/Auth.module.css';
import TicketBackground from '../assets/TicketsBackground.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [warningOpen, setWarningOpen] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length > 0) return;
    
        try {
            const loginUrl = `http://localhost:8080/login`;
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
    
                // Store warning data if exists
                if (data.membershipWarning) {
                    const formattedDate = new Date(data.expireDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    localStorage.setItem('membershipWarning', 'true');
                    localStorage.setItem('expiryDate', formattedDate);
                }
    
                // Navigate based on role
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

    const handleWarningClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setWarningOpen(false);
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

            <Snackbar
                open={warningOpen}
                autoHideDuration={null}
                onClose={handleWarningClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    mt: 2,
                    maxWidth: '600px',
                    width: '100%'
                }}
            >
                <Alert
                    onClose={handleWarningClose}
                    severity="warning"
                    sx={{
                        width: '100%',
                        backgroundColor: '#FFF8E1',
                        color: '#8B6E00',
                        '& .MuiAlert-action': {
                            alignItems: 'center'
                        },
                        border: '1px solid #FFE082',
                        borderRadius: '4px',
                        '& .MuiAlert-icon': {
                            display: 'none' // Removes the warning icon
                        }
                    }}
                    action={
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleWarningClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    <Typography 
                        sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            color: '#8B6E00',
                            fontSize: '1.1rem'
                        }}
                    >
                        Membership Expiration Notice
                    </Typography>
                    <Typography sx={{ color: '#8B6E00' }}>
                        Your individual membership will expire on {expiryDate}. Please renew your membership to continue enjoying museum benefits.
                    </Typography>
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Login;