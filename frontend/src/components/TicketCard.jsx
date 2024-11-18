import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const TicketCard = ({ ticket }) => {
    // Ensure price_at_purchase is a number
    let priceAtPurchase = parseFloat(ticket.price_at_purchase);

    // Handle cases where priceAtPurchase is NaN
    if (isNaN(priceAtPurchase)) {
        priceAtPurchase = 0;
    }

    // Alternatively, using nullish coalescing operator
    // const priceAtPurchase = parseFloat(ticket.price_at_purchase ?? 0);

    return (
        <StyledCard>
            <CardContent
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                <Box>
                    <Typography variant="h5" gutterBottom>
                        Ticket #{ticket.ticket_id}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        {ticket.admission_type} - {ticket.price_category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Price at Purchase: ${priceAtPurchase.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Purchase Date: {new Date(ticket.transaction_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Visit Date: {new Date(ticket.visit_date).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default TicketCard;
