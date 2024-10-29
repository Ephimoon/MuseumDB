import React, { useState } from 'react';
import {
    Box, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
    InputAdornment, TextField, Typography
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountIcon from '@mui/icons-material/AccountBox';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';
        if (!email) newErrors.email = 'Email is required';
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, dateOfBirth, username, password, email }),
            });
            if (response.ok) {
                setOpenDialog(true);
            } else {
                const data = await response.json();
                setErrors({ server: data.message });
            }
        } catch (error) {
            setErrors({ server: 'Error registering user.' });
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        navigate('/login');
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Register</Typography>
                {errors.server && <Typography color="error">{errors.server}</Typography>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>),
                                }}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
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
                            startAdornment: (<InputAdornment position="start">
                                <AccountIcon />
                            </InputAdornment>),
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
                            startAdornment: (<InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        error={!!errors.email}
                        helperText={errors.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>),
                        }}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                    <Typography variant="body2">
                        Already have an account? <Link to="/login">Login here</Link>
                    </Typography>
                </Box>
                <Dialog open={openDialog} onClose={handleDialogClose}>
                    <DialogTitle>Registration Successful</DialogTitle>
                    <DialogContent>Thank you for registering!</DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">OK</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}
