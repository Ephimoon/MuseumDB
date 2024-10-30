import React, { useState } from 'react';
import { Container, Box, Button, TextField, Typography, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const response = await fetch('http://cosc3380museum-api-gsd9hhaygpcze8eu.centralus-01.azurewebsites.net/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Verification email sent successfully! Please check your inbox.');
            } else {
                const data = await response.json();
                setErrors({ server: data.message });
            }
        } catch (error) {
            setErrors({ server: 'Error sending verification email.' });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Verify Your Email</Typography>
                {message && <Typography color="primary">{message}</Typography>}
                {errors.server && <Typography color="error">{errors.server}</Typography>}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        error={!!errors.email}
                        helperText={errors.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                        Send Verification Email
                    </Button>
                    <Button fullWidth variant="outlined" color="secondary" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
