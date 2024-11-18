import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    CssBaseline,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import AccountIcon from '@mui/icons-material/AccountBox'; // Import AccountIcon
import LockIcon from '@mui/icons-material/Lock'; // Import LockIcon
import HomeNavBar from '../components/HomeNavBar';
import '../css/Auth.module.css';
import TicketBackground from '../assets/TicketsBackground.png';
import { toast } from 'react-toastify'; // Import toast
// config

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        username: '',
        password: '',
        email: '',
        roleId: 3, // Default to 'customer'
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.email) newErrors.email = 'Email is required';
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Display validation errors using toast
            Object.values(newErrors).forEach((error) => toast.error(error));
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                navigate('/login');
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    // Display field-specific errors
                    Object.values(errorData.errors).forEach((error) => toast.error(error));
                } else {
                    // Display general error message
                    toast.error(errorData.message || 'Error registering user.');
                }
            }
        } catch (error) {
            console.error('Error registering:', error);
            toast.error('Error registering user.');
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
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        value={formData.firstName}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonAddIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        value={formData.lastName}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonAddIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        error={!!errors.username}
                        helperText={errors.username}
                        value={formData.username}
                        onChange={handleChange}
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
                        name="password"
                        error={!!errors.password}
                        helperText={errors.password}
                        value={formData.password}
                        onChange={handleChange}
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
                        id="email"
                        label="Email"
                        type="email"
                        name="email"
                        error={!!errors.email}
                        helperText={errors.email}
                        value={formData.email}
                        onChange={handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {/* Optionally, allow admins to select role during registration */}
                    {/* Uncomment the following block if needed */}
                    {/*
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="roleId"
                            name="roleId"
                            value={formData.roleId}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>Admin</MenuItem>
                            <MenuItem value={2}>Staff</MenuItem>
                            <MenuItem value={3}>Customer</MenuItem>
                            <MenuItem value={4}>Member</MenuItem>
                        </Select>
                    </FormControl>
                    */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="purchase-button"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                        Already have an account? <Link to="/login">Login here</Link>
                    </Typography>
                </Box>
            </div>
        </div>
    );
};

export default Register;
