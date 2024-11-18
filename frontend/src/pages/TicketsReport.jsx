// src/pages/TicketsReport.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/Report.module.css';
import HomeNavBar from '../components/HomeNavBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const TicketsReport = () => {
    const [reportType, setReportType] = useState('revenue'); // 'tickets', 'revenue', 'transaction_details'
    const [reportPeriodType, setReportPeriodType] = useState('date_range'); // 'date_range', 'month', 'year', or 'single_day'

    const [startDate, setStartDate] = useState(null); // Date object
    const [endDate, setEndDate] = useState(null); // Date object
    const [selectedMonth, setSelectedMonth] = useState(null); // Date object
    const [selectedYear, setSelectedYear] = useState(null); // Date object
    const [selectedDate, setSelectedDate] = useState(null); // Date object

    const [paymentMethod, setPaymentMethod] = useState('');
    const [priceCategory, setPriceCategory] = useState(['All Price Categories']);
    const [userTypeId, setUserTypeId] = useState('');

    // Retrieve from backend
    const [availableUserTypes, setAvailableUserTypes] = useState([]);
    const [availablePriceCategories, setAvailablePriceCategories] = useState([]);
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);

    const [reportData, setReportData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    // Redirect non-admin and non-staff users
    useEffect(() => {
        if (role !== 'admin' && role !== 'staff') {
            navigate('/'); // Redirect to home or appropriate page
        }
    }, [role, navigate]);

    // Fetch options from backend
    useEffect(() => {
        Promise.all([
            // Fetch available price categories
            axios.get(`${process.env.REACT_APP_API_URL}/ticket`, {
                headers: { 'Content-Type': 'application/json' },
            }),
            // Fetch available user types
            axios.get(`${process.env.REACT_APP_API_URL}/user-type`, {
                headers: { 'Content-Type': 'application/json' },
            }),
            // Fetch available payment methods
            axios.get(`${process.env.REACT_APP_API_URL}/paymentmethods`, {
                headers: { 'Content-Type': 'application/json' },
            }),
        ])
            .then(([priceResponse, userResponse, paymentResponse]) => {
                setAvailablePriceCategories(priceResponse.data || []);
                setAvailableUserTypes(userResponse.data || []);
                setAvailablePaymentMethods(paymentResponse.data || []);
            })
            .catch((error) => {
                console.error('Error fetching options:', error);
                setErrorMessage('Error loading options');
            });
    }, [reportType]);

    // Clear report data when report period type changes
    useEffect(() => {
        setReportData([]);
        setErrorMessage('');
    }, [reportPeriodType]);

    // Fetch report data when the "Generate Report" button is clicked
    const fetchReportData = () => {
        // Input validation
        if (!reportType) {
            setErrorMessage('Please select a report type.');
            return;
        }
        if (reportPeriodType === 'date_range') {
            if (!startDate || !endDate) {
                setErrorMessage('Please select start and end dates.');
                return;
            }
            if (startDate > endDate) {
                setErrorMessage('Start date cannot be after end date.');
                return;
            }
        } else if (reportPeriodType === 'month') {
            if (!selectedMonth) {
                setErrorMessage('Please select a month.');
                return;
            }
        } else if (reportPeriodType === 'year') {
            if (!selectedYear) {
                setErrorMessage('Please select a year.');
                return;
            }
        } else if (reportPeriodType === 'single_day') {
            if (!selectedDate) {
                setErrorMessage('Please select a date.');
                return;
            }
        }

        if (!priceCategory || priceCategory.length === 0) {
            setErrorMessage('Please select at least one price category.');
            return;
        }

        setErrorMessage('');
        setLoading(true);

        // Prepare data for backend
        const reportRequest = {
            report_type: reportType,
            reportPeriodType: reportPeriodType,
            start_date: startDate ? startDate.toISOString().split('T')[0] : '',
            end_date: endDate ? endDate.toISOString().split('T')[0] : '',
            selected_month: selectedMonth
                ? selectedMonth.toISOString().split('T')[0].slice(0, 7)
                : '',
            selected_year: selectedYear ? selectedYear.getFullYear().toString() : '',
            selected_date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            price_category: priceCategory.includes('All Price Categories')
                ? availablePriceCategories.map((cat) => cat.price_category)
                : priceCategory,
            user_type_id:
                userTypeId === 'customer' ? 3 : userTypeId === 'member' ? 4 : null,
            payment_method: paymentMethod,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/reports-tickets`, reportRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    role: role,
                },
            })
            .then((response) => {
                setReportData(response.data || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching report data:', error);
                setErrorMessage(
                    error.response?.data?.message || 'Error fetching report data.'
                );
                setLoading(false);
                setReportData([]);
            });
    };

    const handlePriceCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setReportData([]);
        setErrorMessage('');

        if (selectedValue === 'All Price Categories') {
            // Reset to "All Price Categories" only
            setPriceCategory(['All Price Categories']);
        } else {
            setPriceCategory((prevCategories) => {
                // Remove "All Price Categories" and add the selected category
                const updatedCategories = prevCategories.filter(
                    (cat) => cat !== 'All Price Categories'
                );

                const newCategories = [...updatedCategories, selectedValue];

                // Check if all categories are selected
                const allSelected = availablePriceCategories.every((pcategory) =>
                    newCategories.includes(pcategory.price_category)
                );

                if (allSelected) {
                    // Automatically set to "All Price Categories" if all categories are selected
                    return ['All Price Categories'];
                }

                return newCategories;
            });
        }
    };

    const removeCategory = (category) => {
        setReportData([]);
        setErrorMessage('');
        setPriceCategory((prevCategories) => {
            if (category === 'All Price Categories') {
                // Prevent "All Price Categories" from being removed
                return prevCategories;
            }

            const updatedCategories = prevCategories.filter((cat) => cat !== category);

            // If all categories are removed, reset to "All Price Categories"
            if (updatedCategories.length === 0) {
                return ['All Price Categories'];
            }

            return updatedCategories;
        });
    };

    const handleGenerateReport = () => {
        fetchReportData();
    };

    // Function to render report data based on report type
    const renderReportTable = () => {
        if (loading) {
            return <p>Loading report...</p>;
        }

        if (reportData.length === 0) {
            return <p>No data available for the selected report.</p>;
        }

        if (reportType === 'revenue' && reportPeriodType === 'single_day') {
            return renderSingleDayRevenueReport();
        }
        if (reportType === 'tickets' && reportPeriodType === 'single_day') {
            return renderSingleDayTicketsReport();
        }

        switch (reportType) {
            case 'revenue':
                return renderRevenueReport();
            case 'tickets':
                return renderTicketsReport();
            case 'transaction_details':
                return renderTransactionDetailsReport();
            default:
                return null;
        }
    };

    const renderRevenueReport = () => {
        // Calculate total revenue
        const totalRevenue = reportData.reduce(
            (acc, curr) => acc + parseFloat(curr.total_revenue || 0),
            0
        );

        return (
            <>
                <table className={styles.reportTable}>
                    <thead>
                    <tr>
                        <th>{getDateLabel()}</th>
                        <th>Total Revenue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportData.map((item, index) => {
                        const revenue = Number(item.total_revenue);
                        const formattedRevenue = isNaN(revenue)
                            ? 'N/A'
                            : revenue.toFixed(2);

                        return (
                            <tr key={index}>
                                <td>{formatDateLabel(item.date)}</td>
                                <td>${formattedRevenue}</td>
                            </tr>
                        );
                    })}
                    {/* Total Revenue Row */}
                    <tr>
                        <td>
                            <strong>Total Revenue</strong>
                        </td>
                        <td>
                            <strong>${totalRevenue.toFixed(2)}</strong>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        );
    };

    const renderTicketsReport = () => {
        if (!reportData || reportData.length === 0) {
            return <p>No data available for the selected filters.</p>;
        }

        // Calculate total tickets
        const totalTickets = reportData.reduce(
            (acc, curr) => acc + parseFloat(curr.total_tickets || 0),
            0
        );

        return (
            <>
                <table className={styles.reportTable}>
                    <thead>
                    <tr>
                        <th>{getDateLabel()}</th>
                        <th>Total Tickets</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportData.map((item, index) => {
                        const tickets = Number(
                            item.total_tickets || item.total_tickets_sold
                        );
                        const formattedTickets = isNaN(tickets)
                            ? 'N/A'
                            : tickets.toFixed(0);

                        return (
                            <tr key={index}>
                                <td>{formatDateLabel(item.date)}</td>
                                <td>{formattedTickets}</td>
                            </tr>
                        );
                    })}
                    {/* Total Tickets Row */}
                    <tr>
                        <td>
                            <strong>Total Tickets</strong>
                        </td>
                        <td>
                            <strong>{totalTickets.toFixed(0)}</strong>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        );
    };

    // Function to render revenue report for 'single_day' period type
    const renderSingleDayRevenueReport = () => {
        const transactions = {};

        reportData.forEach((item) => {
            if (!transactions[item.transaction_id]) {
                transactions[item.transaction_id] = {
                    transaction_id: item.transaction_id,
                    transaction_date: item.transaction_date,
                    transaction_type: item.transaction_type,
                    payment_status: item.payment_status,
                    username: item.username,
                    items: [],
                    total_amount: 0,
                };
            }
            if (item.quantity) {
                transactions[item.transaction_id].items.push({
                    item_name: item.price_category || 'Ticket',
                    quantity: item.quantity,
                    price_at_purchase: item.price_at_purchase || 0,
                    item_total: item.quantity * (item.price_at_purchase || 0),
                });
                transactions[item.transaction_id].total_amount +=
                    item.quantity * (item.price_at_purchase || 0);
            }
        });

        const transactionsArray = Object.values(transactions);

        const grandTotal = transactionsArray.reduce(
            (sum, transaction) => sum + transaction.total_amount,
            0
        );

        return (
            <>
                <table className={styles.reportTable}>
                    <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Transaction Time</th>
                        <th>User</th>
                        <th>Payment Method</th>
                        <th>Payment Status</th>
                        <th>Ticket Types</th>
                        <th>Total Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactionsArray.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.transaction_id}</td>
                            <td>
                                {new Date(
                                    transaction.transaction_date
                                ).toLocaleString()}
                            </td>
                            <td>{transaction.username}</td>
                            <td>{transaction.transaction_type}</td>
                            <td>{transaction.payment_status}</td>
                            <td>
                                {transaction.items.map((item, idx) => (
                                    <div key={idx}>
                                        <strong>{item.item_name}</strong>
                                        <br />
                                        Quantity: {item.quantity}
                                        <br />
                                        Price: $
                                        {parseFloat(
                                            item.price_at_purchase
                                        ).toFixed(2)}
                                        <br />
                                        Item Total: $
                                        {parseFloat(item.item_total).toFixed(
                                            2
                                        )}
                                        <br />
                                    </div>
                                ))}
                            </td>
                            <td>${transaction.total_amount.toFixed(2)}</td>
                        </tr>
                    ))}
                    {/* Total Revenue Row */}
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Total Revenue:
                        </td>
                        <td style={{ fontWeight: 'bold' }}>${grandTotal.toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>
            </>
        );
    };

    const renderSingleDayTicketsReport = () => {
        const transactions = {};

        reportData.forEach((item) => {
            if (!transactions[item.transaction_id]) {
                transactions[item.transaction_id] = {
                    transaction_id: item.transaction_id,
                    transaction_date: item.transaction_date,
                    transaction_type: item.transaction_type,
                    payment_status: item.payment_status,
                    username: item.username,
                    items: [],
                    total_tickets: 0,
                };
            }
            transactions[item.transaction_id].items.push({
                item_name: item.price_category || 'Ticket',
                quantity: item.quantity,
            });
            transactions[item.transaction_id].total_tickets += parseInt(
                item.quantity,
                10
            );
        });

        const transactionsArray = Object.values(transactions);

        const grandTotalTickets = transactionsArray.reduce(
            (sum, transaction) => sum + transaction.total_tickets,
            0
        );

        return (
            <>
                <table className={styles.reportTable}>
                    <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Transaction Time</th>
                        <th>User</th>
                        <th>Payment Method</th>
                        <th>Payment Status</th>
                        <th>Ticket Types</th>
                        <th>Total Tickets</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactionsArray.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.transaction_id}</td>
                            <td>
                                {new Date(
                                    transaction.transaction_date
                                ).toLocaleString()}
                            </td>
                            <td>{transaction.username}</td>
                            <td>{transaction.transaction_type}</td>
                            <td>{transaction.payment_status}</td>
                            <td>
                                {transaction.items.map((item, idx) => (
                                    <div key={idx}>
                                        <strong>{item.item_name}</strong>
                                        <br />
                                        Quantity: {item.quantity}
                                        <br />
                                    </div>
                                ))}
                            </td>
                            <td>{transaction.total_tickets}</td>
                        </tr>
                    ))}
                    {/* Total Tickets Row */}
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Total Tickets:
                        </td>
                        <td style={{ fontWeight: 'bold' }}>{grandTotalTickets}</td>
                    </tr>
                    </tbody>
                </table>
            </>
        );
    };

    const renderTransactionDetailsReport = () => {
        return (
            <table className={styles.reportTable}>
                <thead>
                <tr>
                    <th>Transaction ID</th>
                    <th>Transaction Date</th>
                    <th>User</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Ticket Name</th>
                    <th>Quantity</th>
                    <th>Price at Purchase</th>
                    <th>Item Total</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.transaction_id}</td>
                        <td>{new Date(item.transaction_date).toLocaleString()}</td>
                        <td>{item.username}</td>
                        <td>{item.transaction_type}</td>
                        <td>{item.payment_status}</td>
                        <td>{item.price_category}</td>
                        <td>{item.quantity}</td>
                        <td>${parseFloat(item.price_at_purchase).toFixed(2)}</td>
                        <td>${parseFloat(item.item_total).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    // Helper functions to get and format date labels
    const getDateLabel = () => {
        if (
            reportPeriodType === 'month' ||
            reportPeriodType === 'date_range' ||
            reportPeriodType === 'single_day'
        ) {
            return 'Date';
        } else if (reportPeriodType === 'year') {
            return 'Month';
        }
        return 'Date';
    };

    // Updated formatDateLabel function
    const formatDateLabel = (dateStr) => {
        if (!dateStr) {
            return 'N/A';
        }

        if (
            reportPeriodType === 'month' ||
            reportPeriodType === 'date_range' ||
            reportPeriodType === 'single_day'
        ) {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj)) {
                return 'Invalid Date';
            }
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } else if (reportPeriodType === 'year') {
            // dateStr is expected to be 'YYYY-MM'
            const [year, month] = dateStr.split('-');
            const monthNames = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
        }
        return dateStr;
    };

    const generatePDF = () => {
        // Implement your PDF generation logic here
    };

    return (
        <div className={styles.reportContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Tickets Report</h1>
            <div className={styles.filterContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="reportType">Report Type:</label>
                    <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            setPaymentMethod('');
                            setPriceCategory(['All Price Categories']);
                            setUserTypeId('');
                            setReportData([]);
                            setErrorMessage('');
                        }}
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="tickets">Tickets Report</option>
                        <option value="transaction_details">
                            Transaction Details Report
                        </option>
                    </select>
                </div>

                {/* Report Period Type Selection using Buttons */}
                <div className={styles.formGroup}>
                    <label>Report Period:</label>
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.toggleButton} ${
                                reportPeriodType === 'date_range'
                                    ? styles.activeButton
                                    : ''
                            }`}
                            onClick={() => {
                                setReportPeriodType('date_range');
                                setReportData([]);
                                setErrorMessage('');
                            }}
                        >
                            By Date Range
                        </button>
                        <button
                            className={`${styles.toggleButton} ${
                                reportPeriodType === 'month'
                                    ? styles.activeButton
                                    : ''
                            }`}
                            onClick={() => {
                                setReportPeriodType('month');
                                setReportData([]);
                                setErrorMessage('');
                            }}
                        >
                            By Month
                        </button>
                        <button
                            className={`${styles.toggleButton} ${
                                reportPeriodType === 'year'
                                    ? styles.activeButton
                                    : ''
                            }`}
                            onClick={() => {
                                setReportPeriodType('year');
                                setReportData([]);
                                setErrorMessage('');
                            }}
                        >
                            By Year
                        </button>
                        <button
                            className={`${styles.toggleButton} ${
                                reportPeriodType === 'single_day'
                                    ? styles.activeButton
                                    : ''
                            }`}
                            onClick={() => {
                                setReportPeriodType('single_day');
                                setReportData([]);
                                setErrorMessage('');
                            }}
                        >
                            Single Day
                        </button>
                    </div>
                </div>

                {(reportType === 'revenue' || reportType === 'tickets') && (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="priceCategory">Price Category:</label>
                            <select
                                id="priceCategory"
                                onChange={handlePriceCategoryChange}
                                value={
                                    priceCategory.includes('All Price Categories')
                                        ? 'All Price Categories'
                                        : priceCategory[priceCategory.length - 1]
                                }
                            >
                                <option value="All Price Categories">
                                    All Price Categories
                                </option>
                                {availablePriceCategories.map((pcategory, index) => (
                                    <option
                                        key={index}
                                        value={pcategory.price_category}
                                    >
                                        {pcategory.price_category}
                                    </option>
                                ))}
                            </select>

                            {/* Display the selected categories as buttons */}
                            <div className={styles.selectedCategoriesContainer}>
                                {priceCategory.map((category, index) => (
                                    <button
                                        key={index}
                                        className={styles.categoryButton}
                                        onClick={() => removeCategory(category)}
                                    >
                                        {category}{' '}
                                        <span className={styles.closeButton}>×</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="userTypeId">User Type:</label>
                            <select
                                id="userTypeId"
                                value={userTypeId}
                                onChange={(e) => {
                                    setUserTypeId(e.target.value);
                                    setReportData([]);
                                    setErrorMessage('');
                                }}
                            >
                                <option value="">All User Types</option>
                                {availableUserTypes.map((usertype) => (
                                    <option
                                        key={usertype.role_name}
                                        value={usertype.role_name}
                                    >
                                        {usertype.role_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="paymentMethod">Payment Method:</label>
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => {
                                    setPaymentMethod(e.target.value);
                                    setReportData([]);
                                    setErrorMessage('');
                                }}
                            >
                                <option value="">All Payment Methods</option>
                                {availablePaymentMethods.map((method, index) => (
                                    <option
                                        key={index}
                                        value={method.transaction_type}
                                    >
                                        {method.transaction_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* Date Range Inputs */}
                {reportPeriodType === 'date_range' && (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="startDate">Start Date:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                className={styles.datePicker}
                                placeholderText="Select Start Date"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="endDate">End Date:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="yyyy-MM-dd"
                                className={styles.datePicker}
                                placeholderText="Select End Date"
                            />
                        </div>
                    </>
                )}

                {/* Month Picker Input */}
                {reportPeriodType === 'month' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="selectedMonth">Select Month:</label>
                        <DatePicker
                            selected={selectedMonth}
                            onChange={(date) => setSelectedMonth(date)}
                            dateFormat="yyyy-MM"
                            showMonthYearPicker
                            className={styles.datePicker}
                            placeholderText="Select Month"
                        />
                    </div>
                )}

                {/* Year Picker Input */}
                {reportPeriodType === 'year' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="selectedYear">Select Year:</label>
                        <DatePicker
                            selected={selectedYear}
                            onChange={(date) => setSelectedYear(date)}
                            dateFormat="yyyy"
                            showYearPicker
                            className={styles.datePicker}
                            placeholderText="Select Year"
                        />
                    </div>
                )}

                {/* Single Day Picker Input */}
                {reportPeriodType === 'single_day' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="selectedDate">Select Date:</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className={styles.datePicker}
                            placeholderText="Select Date"
                        />
                    </div>
                )}

                {errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}

                <button className={styles.generateButton} onClick={handleGenerateReport}>
                    Generate Report
                </button>
                {reportData.length > 0 && (
                    <button className={styles.generateButton} onClick={generatePDF}>
                        Download PDF
                    </button>
                )}
            </div>
            <div className={styles.tableContainer}>{renderReportTable()}</div>
        </div>
    );
};

export default TicketsReport;
