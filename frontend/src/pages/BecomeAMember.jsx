import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    Grid,
    CssBaseline,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import BecomeMemberBackground from '../assets/BecomeAMemberBackground.png';

const BecomeAMember = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        username: '',
        password: '',
        email: '',
        membershipType: '',
    });

    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
        // If it was a success message, navigate after closing
        if (snackbar.severity === 'success') {
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        const submitData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            type_of_membership: formData.membershipType
        };
        
        try {
            const response = await fetch('http://localhost:5000/membership-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                    setSnackbar({
                        open: true,
                        message: 'Please fix the errors in the form',
                        severity: 'error'
                    });
                    setIsLoading(false);
                    return;
                }
                throw new Error(data.error || 'Registration failed');
            }

            setSnackbar({
                open: true,
                message: 'Membership registration successful! Redirecting to home page...',
                severity: 'success'
            });

            // Clear form after success
            setFormData({
                firstName: '',
                lastName: '',
                dob: '',
                username: '',
                password: '',
                email: '',
                membershipType: '',
            });

            // Navigate after delay
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('Error during registration:', error);
            setSnackbar({
                open: true,
                message: error.message || 'An error occurred during registration',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="become-member-container"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BecomeMemberBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <HomeNavBar />
            <div className="register-container" style={{
                marginTop: '100px',
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                width: '500px',
                maxWidth: '90%',
            }}>
                <CssBaseline />
                <Typography component="h1" variant="h5" style={{ color: '#333', marginBottom: '20px' }}>
                    Become a Member
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                name="firstName"
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                name="lastName"
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        name="dob"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 2 }}
                        error={!!errors.dob}
                        helperText={errors.dob}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        value={formData.username}
                        onChange={handleChange}
                        name="username"
                        error={!!errors.username}
                        helperText={errors.username}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountBoxIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        name="email"
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="membership-type-label">Membership Type</InputLabel>
                        <Select
                            labelId="membership-type-label"
                            id="membershipType"
                            name="membershipType"
                            value={formData.membershipType}
                            onChange={handleChange}
                            label="Membership Type"
                            error={!!errors.membershipType}
                        >
                            <MenuItem value="family">Family</MenuItem>
                            <MenuItem value="individual">Individual</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        sx={{ 
                            mt: 2, 
                            mb: 2,
                            height: 48,
                            position: 'relative'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        left: '50%',
                                        marginLeft: '-12px'
                                    }}
                                />
                                Processing...
                            </>
                        ) : (
                            'Complete Membership Registration'
                        )}
                    </Button>
                </Box>
            </div>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{
                    '& .MuiAlert-root': {
                        width: '100%',
                        maxWidth: '600px',
                        fontSize: '1rem'
                    }
                }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ 
                        width: '100%',
                        '& .MuiAlert-message': {
                            width: '100%',
                            textAlign: 'center'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BecomeAMember;
