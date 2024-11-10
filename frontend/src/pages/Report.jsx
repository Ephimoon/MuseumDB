// src/pages/Report.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/Report.module.css';
import HomeNavBar from '../components/HomeNavBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const Report = () => {
    const [reportCategory, setReportCategory] = useState('GiftShopReport');
    const [reportType, setReportType] = useState('revenue');
    const [reportOptionTickets, setReportOptionTickets] = useState('totalTickets'); // Added for TicketsReport
    const [reportPeriodType, setReportPeriodType] = useState('date_range'); // 'date_range', 'month', 'year', or 'single_day'
    const [startDate, setStartDate] = useState(null); // Date object
    const [endDate, setEndDate] = useState(null); // Date object
    const [selectedMonth, setSelectedMonth] = useState(null); // Date object
    const [selectedYear, setSelectedYear] = useState(null); // Date object
    const [selectedDate, setSelectedDate] = useState(null); // Date object
    const [itemCategory, setItemCategory] = useState('');
    const [priceCategory, setPriceCategory] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [itemId, setItemId] = useState('');
    const [userTypeId, setUserTypeId] = useState('');
    const [availableItems, setAvailableItems] = useState([]);
    const [availableUserTypes, setAvailableUserTypes] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availablePriceCategories, setAvailablePriceCategories] = useState([]);
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    // Redirect non-admin and non-staff users
    useEffect(() => {
        if (role !== 'admin' && role !== 'staff') {
            navigate('/'); // Redirect to home or appropriate page
        }
    }, [role, navigate]);

    // Fetch available options for the filters when reportType or reportCategory changes
    useEffect(() => {
        if (reportType === 'revenue' || reportType === 'transaction_details') {
            if (reportCategory === 'GiftShopReport') {
                // Fetch available items
                axios
                    .get(`${process.env.REACT_APP_API_URL}/giftshopitemsreport`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => setAvailableItems(response.data))
                    .catch((error) => console.error('Error fetching items:', error));

                // Fetch available categories
                axios
                    .get(`${process.env.REACT_APP_API_URL}/giftshopcategories`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => setAvailableCategories(response.data))
                    .catch((error) => console.error('Error fetching categories:', error));

                // Fetch available payment methods
                axios
                    .get(`${process.env.REACT_APP_API_URL}/paymentmethods`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => setAvailablePaymentMethods(response.data))
                    .catch((error) => console.error('Error fetching payment methods:', error));
            } else if (reportCategory === 'TicketsReport') {
                // Fetch available price categories
                axios
                    .get(`${process.env.REACT_APP_API_URL}/ticket`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => setAvailablePriceCategories(response.data))
                    .catch((error) => console.error('Error fetching price categories:', error));

                // Fetch available user types
                axios
                    .get(`${process.env.REACT_APP_API_URL}/user-type`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => setAvailableUserTypes(response.data))
                    .catch((error) => console.error('Error fetching user types:', error));

                // Fetch available payment methods
                axios
                    .get(`${process.env.REACT_APP_API_URL}/paymentmethods`, {
                        headers: { 'Content-Type': 'application/json' },
                    })
                    .then((response) => setAvailablePaymentMethods(response.data))
                    .catch((error) => console.error('Error fetching payment methods:', error));
            }
        }
    }, [reportType, reportCategory]);

    // Clear report data when report period type changes
    useEffect(() => {
        setReportData([]);
        setErrorMessage('');
    }, [reportPeriodType]);

    // Fetch report data when the "Generate Report" button is clicked
    const fetchReportData = () => {
        // Input validation
        if (!reportCategory) {
            setErrorMessage('Please select a report category.');
            return;
        }
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

        setErrorMessage('');
        setLoading(true);

        // Prepare data for backend
        const reportRequest = {
            report_category: reportCategory,
            report_type: reportType,
            report_option_tickets: reportOptionTickets,
            report_period_type: reportPeriodType,
            start_date: startDate ? startDate.toISOString().split('T')[0] : '',
            end_date: endDate ? endDate.toISOString().split('T')[0] : '',
            selected_month: selectedMonth ? selectedMonth.toISOString().split('T')[0].slice(0, 7) : '',
            selected_year: selectedYear ? selectedYear.getFullYear().toString() : '',
            selected_date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            item_category: itemCategory,
            payment_method: paymentMethod,
            item_id: itemId,
            price_category: priceCategory,
            user_type_id: userTypeId === "Both" ? availableUserTypes.map((user) => user.role_name) : userTypeId,
        };

        // Retrieve user credentials from localStorage
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');

        axios
            .post(`${process.env.REACT_APP_API_URL}/reports`, reportRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    role: role,
                },
            })
            .then((response) => {
                setReportData(response.data.reportData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching report data:', error);
                setErrorMessage(
                    error.response?.data?.message || 'Error fetching report data.'
                );
                setLoading(false);
            });
    };

    const handlePriceCategoryChange = (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === "All Price Categories") {
            // If "All Price Categories" is selected, add or clear All Price Categories
            setPriceCategory((prevCategories) => {
                if (prevCategories.includes("All Price Categories")) {
                    // If already selected, deselect all
                    return [];
                } else {
                    // Select All Price Categories
                    return ["All Price Categories", ...availablePriceCategories.map((pcategory) => pcategory.price_category)];
                }
            });
        } else {
            // Handle individual category selection
            setPriceCategory((prevCategories) => {
                // Remove "All Price Categories" if any other category is selected individually
                const updatedCategories = prevCategories.includes("All Price Categories")
                    ? availablePriceCategories.map((pcategory) => pcategory.price_category)
                    : prevCategories;

                if (!updatedCategories.includes(selectedValue)) {
                    return [...updatedCategories, selectedValue];
                } else {
                    return updatedCategories.filter((category) => category !== selectedValue);
                }
            });
        }
    };

    const removeCategory = (category) => {
        setPriceCategory((prevCategories) => {
            // If "All Price Categories" is being removed, deselect everything
            if (category === "All Price Categories") {
                return [];
            }

            // Otherwise, remove the selected category
            const updatedCategories = prevCategories.filter((cat) => cat !== category);

            // If All Price Categories are deselected, also remove "All Price Categories"
            if (updatedCategories.length === availablePriceCategories.length) {
                return updatedCategories.filter((cat) => cat !== "All Price Categories");
            }

            return updatedCategories;
        });
    };

    const handleGenerateReport = () => {
        fetchReportData();
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to render report data based on report type
    const renderReportTable = () => {
        if (loading) {
            return <p>Loading report...</p>;
        }

        if (reportData.length === 0) {
            return <p>No data available for the selected report.</p>;
        }

        // Check for 'revenue' report with 'single_day' period type
        if (reportType === 'revenue' && reportPeriodType === 'single_day') {
            return renderSingleDayRevenueReport();
        }

        if (reportCategory === 'TicketsReport') {
            return renderTicketsReport();
        }

        switch (reportType) {
            case 'revenue':
                return renderRevenueReport();
            case 'transaction_details':
                return renderTransactionDetailsReport();
            default:
                return null;
        }
    };

    const renderTicketsReport = () => {
        // Implement rendering logic based on reportOptionTickets
        switch (reportOptionTickets) {
            case 'totalTickets':
                return renderTotalTicketsReport();
            case 'totalRevenue':
                return renderTotalRevenueReport();
            case 'peakDateSold':
                return renderPeakDateSoldReport();
            default:
                return null;
        }
    };

    const renderTotalTicketsReport = () => {
        // Implement the rendering logic for total tickets sold
        return (
            <table className={styles.reportTable}>
                <thead>
                <tr>
                    <th>{getDateLabel()}</th>
                    <th>Total Tickets Sold</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((item, index) => (
                    <tr key={index}>
                        <td>{formatDateLabel(item.date)}</td>
                        <td>{item.total_tickets_sold}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const renderTotalRevenueReport = () => {
        // Implement the rendering logic for total revenue from tickets
        return (
            <table className={styles.reportTable}>
                <thead>
                <tr>
                    <th>{getDateLabel()}</th>
                    <th>Total Revenue</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((item, index) => (
                    <tr key={index}>
                        <td>{formatDateLabel(item.date)}</td>
                        <td>${parseFloat(item.total_revenue).toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const renderPeakDateSoldReport = () => {
        // Implement the rendering logic for peak date sold
        return (
            <table className={styles.reportTable}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Total Tickets Sold</th>
                </tr>
                </thead>
                <tbody>
                {reportData.map((item, index) => (
                    <tr key={index}>
                        <td>{formatDateLabel(item.date)}</td>
                        <td>{item.total_tickets_sold}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
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
                        // Convert total_revenue to a number
                        const revenue = Number(item.total_revenue);

                        // Handle cases where revenue is not a valid number
                        const formattedRevenue = isNaN(revenue) ? 'N/A' : revenue.toFixed(2);

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

    // New function to render revenue report for 'single_day' period type
    const renderSingleDayRevenueReport = () => {
        // Group transactions by transaction ID to group items within the same transaction
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
            transactions[item.transaction_id].items.push({
                item_id: item.item_id,
                item_name: item.item_name,
                quantity: item.quantity,
                price_at_purchase: item.price_at_purchase,
                item_total: item.item_total,
            });
            transactions[item.transaction_id].total_amount += parseFloat(item.item_total);
        });

        // Convert transactions object to array
        const transactionsArray = Object.values(transactions);

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
                        <th>Items</th>
                        <th>Total Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transactionsArray.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.transaction_id}</td>
                            <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
                            <td>{transaction.username}</td>
                            <td>{transaction.transaction_type}</td>
                            <td>{transaction.payment_status}</td>
                            <td>
                                {transaction.items.map((item, idx) => (
                                    <div key={idx}>
                                        <strong>{item.item_name}</strong> (ID: {item.item_id})<br />
                                        Quantity: {item.quantity}<br />
                                        Price: ${parseFloat(item.price_at_purchase).toFixed(2)}<br />
                                        Item Total: ${parseFloat(item.item_total).toFixed(2)}<br />
                                    </div>
                                ))}
                            </td>
                            <td>${transaction.total_amount.toFixed(2)}</td>
                        </tr>
                    ))}
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
                    <th>Item ID</th>
                    <th>Item Name</th>
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
                        <td>{item.item_id}</td>
                        <td>{item.item_name}</td>
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

    const formatDateLabel = (dateStr) => {
        if (
            reportPeriodType === 'month' ||
            reportPeriodType === 'date_range' ||
            reportPeriodType === 'single_day'
        ) {
            const dateObj = new Date(dateStr);
            return dateObj.toLocaleDateString();
        } else if (reportPeriodType === 'year') {
            const dateObj = new Date(dateStr);
            const options = { year: 'numeric', month: 'long' };
            return dateObj.toLocaleDateString(undefined, options);
        }
        return dateStr;
    };

    // Function to generate PDF of the report
    const generatePDF = () => {
        const doc = new jsPDF();

        if (reportCategory === 'TicketsReport') {
            doc.text('Tickets Report', 14, 20);
            // Implement PDF generation based on reportOptionTickets
            // Similar to the render functions
            // ...
        } else if (reportType === 'revenue' && reportPeriodType === 'single_day') {
            doc.text('Revenue Report - Single Day', 14, 20);
            // Generate PDF for single day revenue report
            // ...
        } else if (reportType === 'revenue') {
            doc.text('Revenue Report', 14, 20);
            let body = reportData.map((item) => {
                const revenue = Number(item.total_revenue);
                const formattedRevenue = isNaN(revenue) ? 'N/A' : revenue.toFixed(2);
                const dateLabel = formatDateLabel(item.date);
                return [dateLabel, formattedRevenue];
            });

            // Add total revenue row
            const totalRevenue = reportData.reduce(
                (acc, curr) => acc + parseFloat(curr.total_revenue || 0),
                0
            );
            body.push(['Total Revenue', totalRevenue.toFixed(2)]);

            doc.autoTable({
                head: [[getDateLabel(), 'Total Revenue']],
                body: body,
                startY: 30,
            });
        } else if (reportType === 'transaction_details') {
            doc.text('Transaction Details Report', 14, 20);

            let body = reportData.map((item) => {
                return [
                    item.transaction_id,
                    new Date(item.transaction_date).toLocaleString(),
                    item.username,
                    item.transaction_type,
                    item.payment_status,
                    item.item_id,
                    item.item_name,
                    item.quantity,
                    parseFloat(item.price_at_purchase).toFixed(2),
                    parseFloat(item.item_total).toFixed(2),
                ];
            });

            doc.autoTable({
                head: [
                    [
                        'Transaction ID',
                        'Transaction Date',
                        'User',
                        'Payment Method',
                        'Payment Status',
                        'Item ID',
                        'Item Name',
                        'Quantity',
                        'Price at Purchase',
                        'Item Total',
                    ],
                ],
                body: body,
                startY: 30,
                styles: { fontSize: 8 },
            });
        }

        doc.save(`${reportType}_report.pdf`);
    };

    return (
        <div className={styles.reportContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Reports</h1>
            <div className={styles.filterContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="reportCategory">Report Category:</label>
                    <select
                        id="reportCategory"
                        value={reportCategory}
                        onChange={(e) => setReportCategory(e.target.value)}
                    >
                        <option value="GiftShopReport">Gift Shop Report</option>
                        <option value="TicketsReport">Tickets Report</option>
                        {/* Add more report categories if needed */}
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="reportType">Report Type:</label>
                    <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            setItemCategory('');
                            setPaymentMethod('');
                            setItemId('');
                        }}
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="transaction_details">Transaction Details Report</option>
                        {/* Add more report types if needed */}
                    </select>
                </div>
                {reportCategory === 'TicketsReport' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="reportOption">Report Options:</label>
                        <select
                            id="reportOption"
                            value={reportOptionTickets}
                            onChange={(e) => {
                                setReportOptionTickets(e.target.value);
                            }}
                        >
                            <option value="totalTickets">Total Tickets</option>
                            <option value="totalRevenue">Total Revenue</option>
                            <option value="peakDateSold">Peak Date Sold</option>
                        </select>
                    </div>
                )}
                {/* Report Period Type Selection using Buttons */}
                <div className={styles.formGroup}>
                    <label>Report Period:</label>
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.toggleButton} ${
                                reportPeriodType === 'date_range' ? styles.activeButton : ''
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
                                reportPeriodType === 'month' ? styles.activeButton : ''
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
                                reportPeriodType === 'year' ? styles.activeButton : ''
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
                                reportPeriodType === 'single_day' ? styles.activeButton : ''
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

                {reportType === 'revenue' && (
                    <>
                        {reportCategory === 'GiftShopReport' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label htmlFor="itemCategory">Category:</label>
                                    <select
                                        id="itemCategory"
                                        value={itemCategory}
                                        onChange={(e) => setItemCategory(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {availableCategories.map((category, index) => (
                                            <option key={index} value={category.category}>
                                                {category.category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="itemId">Item:</label>
                                    <select
                                        id="itemId"
                                        value={itemId}
                                        onChange={(e) => setItemId(e.target.value)}
                                    >
                                        <option value="">All Items</option>
                                        {availableItems.map((item) => (
                                            <option key={item.item_id} value={item.item_id}>
                                                {item.name_}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {reportCategory === 'TicketsReport' && (
                            <>
                                <div className={styles.formGroup}>
                                    <label htmlFor="priceCategory">Price Category:</label>
                                    <select
                                        id="priceCategory"
                                        onChange={handlePriceCategoryChange}
                                        value="" // Set to empty string to reset after each selection
                                    >
                                        <option value="">Select Price Categories</option>
                                        <option value="All Price Categories">All Price Categories</option>
                                        {availablePriceCategories.map((pcategory, index) => (
                                            <option key={index} value={pcategory.price_category}>
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
                                                {category} <span className={styles.closeButton}>×</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="userTypeId">User Type:</label>
                                    <select
                                        id="userTypeId"
                                        value={userTypeId}
                                        onChange={(e) => setUserTypeId(e.target.value)}
                                    >
                                        <option value="">All User Types</option>
                                        <option value="Both">Both</option> {/* Add "Both" option */}
                                        {availableUserTypes.map((usertype) => (
                                            <option key={usertype.role_name} value={usertype.role_name}>
                                                {usertype.role_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className={styles.formGroup}>
                            <label htmlFor="paymentMethod">Payment Method:</label>
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">All Payment Methods</option>
                                {availablePaymentMethods.map((method, index) => (
                                    <option key={index} value={method.transaction_type}>
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

export default Report;
