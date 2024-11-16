import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Alert } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';

// Styled Button consistent with MFAShopModalUser
const StyledButton = styled('button')({
    padding: '8px 12px',
    marginRight: '5px',
    fontSize: '14px',
    color: '#FFFFFF',
    background: 'linear-gradient(90deg, #BD2859 0%, #D22D36 100%)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(90deg, #D22D36 0%, #BD2859 100%)',
    },
});

// Modal Styling
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

const ChangePasswordModal = ({ open, onClose, userId, role }) => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const validatePasswords = () => {
        const errors = {};
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword) errors.currentPassword = 'Current password is required.';
        if (!newPassword) {
            errors.newPassword = 'New password is required.';
        } else if (newPassword.length < 6) {
            errors.newPassword = 'New password must be at least 6 characters long.';
        }
        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your new password.';
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePasswords()) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    'role': role,
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordMessage('Password updated successfully!');
                // Optionally, reset form or close modal after success
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setPasswordErrors({});
                setTimeout(() => {
                    setPasswordMessage('');
                    onClose();
                }, 2000);
            } else {
                // Handle specific error messages from backend
                if (data.message === 'Current password is incorrect.') {
                    setPasswordErrors({ currentPassword: data.message });
                } else if (data.message === 'New password must be at least 6 characters long.') {
                    setPasswordErrors({ newPassword: data.message });
                } else {
                    setPasswordMessage(data.message || 'Error updating password.');
                }
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordMessage('Error updating password.');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>
                    Change Password
                </Typography>
                {passwordMessage && (
                    <Alert severity={passwordMessage.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>
                        {passwordMessage}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="New Password"
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        error={!!passwordErrors.newPassword}
                        helperText={passwordErrors.newPassword}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Confirm New Password"
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handleChange}
                        error={!!passwordErrors.confirmPassword}
                        helperText={passwordErrors.confirmPassword}
                        required
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <StyledButton type="button" onClick={onClose}>
                            Cancel
                        </StyledButton>
                        <StyledButton type="submit">
                            Submit
                        </StyledButton>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

// PropTypes for type checking
ChangePasswordModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
};

export default ChangePasswordModal;
