import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    InputAdornment,
    Grid,
    CssBaseline,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    IconButton
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import BecomeMemberBackground from '../assets/BecomeAMemberBackground.png';

const BecomeAMember = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [formData, setFormData] = useState({
        membershipType: '',
    });

    const [errors, setErrors] = useState({});
    const [membershipMessage, setMembershipMessage] = useState({
        open: false,
        message: 'You do not have a membership. Please login or register to continue',
    });

    // Retrieve data from localStorage with fallbacks
    const firstName = localStorage.getItem('firstName') || 'Unknown';
    const lastName = localStorage.getItem('lastName') || 'Unknown';
    const username = localStorage.getItem('username');

    const [membershipPrice, setMembershipPrice] = useState(0);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const role = localStorage.getItem('role');

                setUserRole(role);

                if (!userId || !role) {
                    setMembershipMessage({
                        open: true,
                        message: 'You do not have a membership. Please login or register to continue',
                    });

                    setTimeout(() => {
                        navigate('/login', {
                            state: {
                                returnTo: '/become-member',
                                showMessage: true,
                                message: 'You do not have a membership. Please login or register to continue',
                            },
                        });
                    }, 4000);
                    return;
                }

                if (role !== 'customer') {
                    setMembershipMessage({
                        open: true,
                        message: 'Access denied. Only customers can register for membership.',
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 4000);
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Access check error:', error);
                setMembershipMessage({
                    open: true,
                    message: 'Error checking access',
                });
                setTimeout(() => {
                    navigate('/');
                }, 4000);
            }
        };

        checkAccess();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'membershipType') {
            // Update the membership price based on the selection
            const price = value === 'standard' ? 55.0 : 80.0;
            setMembershipPrice(price);
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMembershipMessageClose = () => {
        setMembershipMessage((prev) => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');

        // Debug log to verify data
        console.log('Data from localStorage:', {
            firstName,
            lastName,
            userId,
            userRole,
            formData,
        });

        const submitData = {
            user_id: userId,
            first_name: firstName,
            last_name: lastName,
            username: username,
            type_of_membership: formData.membershipType,
            membership_price: membershipPrice,
        };

        try {
            const response = await fetch(`http://localhost:5000/membership-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    role: userRole,
                },
                body: JSON.stringify(submitData),
            });

            // Log what we're sending to the server
            console.log('Sending to server:', submitData);

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                    setMembershipMessage({
                        open: true,
                        message: 'Please fix the errors in the form',
                    });
                    return;
                }
                throw new Error(data.error || 'Registration failed');
            }

            localStorage.setItem('role', 'member');

            setMembershipMessage({
                open: true,
                message: 'Membership registration successful! Redirecting to home page...',
            });

            setTimeout(() => {
                window.location.reload();
                navigate('/');
            }, 1500);
        } catch (error) {
            console.error('Error during registration:', error);
            setMembershipMessage({
                open: true,
                message: error.message || 'An error occurred during registration',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <>
            <div
                className="become-member-container"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BecomeMemberBackground})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '100vh',
                    position: 'relative',
                    marginTop: '-14px',
                }}
            >
                <HomeNavBar />
                <div
                    className="register-container"
                    style={{
                        margin: '100px auto',
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                        width: '500px',
                        maxWidth: '90%',
                    }}
                >
                    <CssBaseline />
                    <Typography
                        component="h1"
                        variant="h5"
                        style={{ color: '#333', marginBottom: '20px' }}
                    >
                        Become a Member
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
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
                                required
                            >
                                <MenuItem value="standard">Standard</MenuItem>
                                <MenuItem value="premium">Premium</MenuItem>
                            </Select>
                        </FormControl>

                        {formData.membershipType && (
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                Price: ${membershipPrice.toFixed(2)}
                            </Typography>
                        )}

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
                                position: 'relative',
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <CircularProgress
                                        size={24}
                                        sx={{
                                            position: 'absolute',
                                            left: '50%',
                                            marginLeft: '-12px',
                                        }}
                                    />
                                    Processing
                                </>
                            ) : (
                                'Complete Membership Registration'
                            )}
                        </Button>
                    </Box>
                </div>

                {membershipMessage.open && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '89px',
                            right: '16px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1000,
                            width: '330px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px',
                            }}
                        >
                            <strong>Membership Access</strong>
                            <IconButton
                                size="small"
                                onClick={handleMembershipMessageClose}
                                style={{
                                    color: 'white',
                                    padding: '2px',
                                    marginRight: '-8px',
                                    marginTop: '-8px',
                                }}
                            >
                                <CloseIcon style={{ fontSize: '16px' }} />
                            </IconButton>
                        </div>
                        <div>{membershipMessage.message}</div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BecomeAMember;
