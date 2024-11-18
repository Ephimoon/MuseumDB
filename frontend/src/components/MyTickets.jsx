// src/pages/MyTickets.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Typography, Box, TextField } from '@mui/material';
import HomeNavBar from '../components/HomeNavBar';
import TicketCard from '../components/TicketCard';
import { toast } from 'react-toastify';
import { styled } from '@mui/system';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FilterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    gap: theme.spacing(2),
}));

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [orderFilter, setOrderFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${userId}/tickets`, {
                    headers: { 'user-id': userId, role },
                });
                console.log('Fetched tickets:', response.data);
                setTickets(response.data);
                setFilteredTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                toast.error('Error fetching your tickets.');
            }
        };

        fetchTickets();
    }, [userId, role]);

    // Handle filtering
    useEffect(() => {
        let tempTickets = [...tickets];

        if (orderFilter) {
            tempTickets = tempTickets.filter(ticket =>
                ticket.transaction_id.toString().includes(orderFilter)
            );
        }

        if (dateFilter) {
            const selectedDate = new Date(dateFilter).toISOString().split('T')[0];
            tempTickets = tempTickets.filter(ticket =>
                ticket.visit_date.startsWith(selectedDate)
            );
        }

        setFilteredTickets(tempTickets);
    }, [orderFilter, dateFilter, tickets]);

    // Group tickets by Visit Date, then by Order #
    const groupedTickets = filteredTickets.reduce((dateGroups, ticket) => {
        const visitDate = new Date(ticket.visit_date).toLocaleDateString();

        if (!dateGroups[visitDate]) {
            dateGroups[visitDate] = {};
        }

        const orders = dateGroups[visitDate];

        const orderKey = `Order #${ticket.transaction_id}`;
        if (!orders[orderKey]) {
            orders[orderKey] = [];
        }

        orders[orderKey].push(ticket);

        return dateGroups;
    }, {});

    return (
        <div>
            <HomeNavBar />
            <Box
                sx={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: '#fcfcfc' }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    align="center"
                    sx={{
                        fontFamily: 'Rosarivo, serif',
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: '#352F36',
                    }}
                >
                    My Tickets
                </Typography>
                <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                    {/* Filter Section */}
                    <FilterContainer>
                        <TextField
                            label="Filter by Order #"
                            variant="outlined"
                            value={orderFilter}
                            onChange={e => setOrderFilter(e.target.value)}
                            sx={{ width: '100%' }}
                        />
                        <TextField
                            label="Filter by Visit Date"
                            type="date"
                            variant="outlined"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ width: '100%' }}
                        />
                    </FilterContainer>

                    {/* Grouped Tickets */}
                    {Object.keys(groupedTickets).length > 0 ? (
                        Object.entries(groupedTickets).map(([visitDate, orders]) => (
                            <Box key={visitDate} sx={{ marginBottom: '40px' }}>
                                <Typography variant="h5" gutterBottom>
                                    Visit Date: {visitDate}
                                </Typography>
                                {Object.keys(orders).length > 1 ? (
                                    // Multiple orders on this date
                                    Object.entries(orders).map(([orderKey, tickets]) => (
                                        <Accordion key={orderKey}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`${orderKey}-content`}
                                                id={`${orderKey}-header`}
                                            >
                                                <Typography variant="h6">{orderKey}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    {tickets.map(ticket => (
                                                        <Grid item xs={12} sm={6} md={4} key={ticket.ticket_id}>
                                                            <TicketCard ticket={ticket} />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))
                                ) : (
                                    // Only one order on this date
                                    Object.entries(orders).map(([orderKey, tickets]) => (
                                        <Box key={orderKey}>
                                            <Typography variant="h6" gutterBottom>
                                                {orderKey}
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {tickets.map(ticket => (
                                                    <Grid item xs={12} sm={6} md={4} key={ticket.ticket_id}>
                                                        <TicketCard ticket={ticket} />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="h6" align="center">
                            You have no tickets.
                        </Typography>
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default MyTickets;
