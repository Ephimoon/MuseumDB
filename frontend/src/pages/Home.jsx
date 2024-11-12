import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Snackbar, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HomeNavBar from '../components/HomeNavBar';
import HomeImage from '../assets/home.png';
import HomeCard from '../components/HomeCard';
import '../css/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [warningOpen, setWarningOpen] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');

    useEffect(() => {
        // Check for warning data when component starts
        const hasWarning = localStorage.getItem('membershipWarning');
        const storedExpiryDate = localStorage.getItem('expiryDate');
        
        if (hasWarning && storedExpiryDate) {
            setExpiryDate(storedExpiryDate);
            setWarningOpen(true);
            // Clear the warning data
            localStorage.removeItem('membershipWarning');
            localStorage.removeItem('expiryDate');
        }
    }, []);

    const handleWarningClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setWarningOpen(false);
    };

    return (
        <div>
            <HomeNavBar />
            {/* Background Image */}
            <img src={HomeImage} alt="MFAH Landing Page Image" className="HomeBackgroundImage" />

            {/* Overlayed content */}
            <div className="home-content">
                <h1 className="heading-title">The Museum of Fine Arts, Houston</h1>
                <button onClick={() => navigate('/Visit')} className="btn">Plan your visit</button>
            </div>

            {/* after the image */}
            <div className='bottom-background'>
                {/* exhibition card */}
                <HomeCard/>

                {/* event card */}
                <HomeCard/>
            </div>

            {/* Membership Warning Snackbar */}
            <Snackbar
    open={warningOpen}
    autoHideDuration={null}
    onClose={handleWarningClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
    sx={{
        mt: 8, 
        mr: 2, 
        maxWidth: '400px', 
        width: '100%',
        zIndex: 9999
    }}
>
    <Alert
        onClose={handleWarningClose}
        severity="warning"
        sx={{
            width: '100%',
            backgroundColor: '#FFF8E1',
            color: '#8B6E00',
            border: '1px solid #FFE082',
            borderRadius: '4px',
            position: 'relative', 
            pr: 4, 
            '& .MuiAlert-action': {
                position: 'absolute', 
                right: 8,           
                top: 8,            
                padding: 0,
                margin: 0
            },
            '& .MuiAlert-icon': {
                display: 'none'
            }
        }}
        action={
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleWarningClose}
                sx={{
                    padding: '4px',
                    margin: 0
                }}
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
                pr: 2 
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

export default Home;