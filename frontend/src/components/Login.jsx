import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    CssBaseline,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AccountIcon from '@mui/icons-material/AccountBox';
import LockIcon from '@mui/icons-material/Lock';
import CloseIcon from '@mui/icons-material/Close';
import HomeNavBar from '../components/HomeNavBar';
import '../css/Auth.module.css';
import TicketBackground from '../assets/TicketsBackground.png';
import { toast } from 'react-toastify';

const Login = () => {
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [warningOpen, setWarningOpen] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
    const [membershipMessage, setMembershipMessage] = useState({
        open: false,
        message: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.showMessage) {
            setMembershipMessage({
                open: true,
                message: location.state.message
            });
        }
    }, [location]);

    const handleMembershipMessageClose = () => {
        setMembershipMessage(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length > 0) return;
    
        try {
            const loginUrl = `http://localhost:5000/login`;
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Received login response:', data); // Debug log
    
                // Check if first_name and last_name exist in response
                if (!data.first_name || !data.last_name) {
                    console.warn('Missing name data in response:', data);
                }
    
                localStorage.setItem('role', data.role);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('username', username);
                localStorage.setItem('firstName', data.first_name || '');  // Handle undefined case
                localStorage.setItem('lastName', data.last_name || '');    // Handle undefined case
    
                // Verify localStorage values
                console.log('localStorage after login:', {
                    firstName: localStorage.getItem('firstName'),
                    lastName: localStorage.getItem('lastName'),
                    role: localStorage.getItem('role'),
                    userId: localStorage.getItem('userId'),
                    username: localStorage.getItem('username')
                });
    
                if (data.membershipWarning) {
                    const formattedDate = new Date(data.expireDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    localStorage.setItem('membershipWarning', 'true');
                    localStorage.setItem('expiryDate', formattedDate);
                    setExpiryDate(formattedDate);
                    setWarningOpen(true);
                }
    
                if (data.role === 'admin') navigate('/AdminDashBoard');
                else if (data.role === 'staff') navigate('/StaffDashboard');
                else if (data.role === 'customer') navigate('/');
                else if (data.role === 'member') navigate('/MemberDashboard');
                else navigate('/');
    
                toast.success('Login successful!');
            } else {
                const data = await response.json();
                setErrors({ server: data.message });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrors({ server: 'Error logging in.' });
        }
    };

    const handleWarningClose = () => {
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
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </Typography>
                </Box>
            </div>

            {membershipMessage.open && (
    <div
        style={{
            position: 'fixed',
            top: '89px',
            right: '16px',
            backgroundColor: '#2196F3', // Keeping the blue color
            color: 'white',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            width: '330px',  // Matching the width of your existing notice
            borderRadius: '4px',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
    >
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '4px'
        }}>
            <strong>Membership Access</strong>
            <IconButton
                size="small"
                onClick={handleMembershipMessageClose}
                style={{ 
                    color: 'white', 
                    padding: '2px',
                    marginRight: '-8px',
                    marginTop: '-8px'
                }}
            >
                <CloseIcon style={{ fontSize: '16px' }} />
            </IconButton>
        </div>
        <div>
            You do not have a membership. Please login or register to continue
        </div>
    </div>
)}

            {/* Existing Warning Snackbar */}
            <Snackbar
                open={warningOpen}
                autoHideDuration={null}
                onClose={handleWarningClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    mt: 2,
                    maxWidth: '600px',
                    width: '100%',
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
                            alignItems: 'center',
                        },
                        border: '1px solid #FFE082',
                        borderRadius: '4px',
                        '& .MuiAlert-icon': {
                            display: 'none',
                        },
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
                            fontSize: '1.1rem',
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