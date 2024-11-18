// src/pages/MembershipReport.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/Report.module.css';
import HomeNavBar from '../components/HomeNavBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';

const MembershipReport = () => {
    const [reportType, setReportType] = useState('revenue');
    const [reportPeriodType, setReportPeriodType] = useState('date_range'); // 'date_range', 'month', 'year', or 'single_day'
    const [startDate, setStartDate] = useState(null); // Date object
    const [endDate, setEndDate] = useState(null); // Date object
    const [selectedMonth, setSelectedMonth] = useState(null); // Date object
    const [selectedYear, setSelectedYear] = useState(null); // Date object
    const [selectedDate, setSelectedDate] = useState(null); // Date object
    const [membershipType, setMembershipType] = useState([]); // Now an array
    const [paymentMethod, setPaymentMethod] = useState([]); // Now an array
    const [availableMembershipTypes, setAvailableMembershipTypes] = useState([]);
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
    const [reportData, setReportData] = useState([]);
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

    // Fetch available options for the filters when component mounts
    useEffect(() => {
        // Fetch available membership types
        axios
            .get(`${process.env.REACT_APP_API_URL}/membership-types`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => setAvailableMembershipTypes(response.data))
            .catch((error) => {
                console.error('Error fetching membership types:', error);
                toast.error('Error fetching membership types.');
            });

        // Fetch available payment methods
        axios
            .get(`${process.env.REACT_APP_API_URL}/paymentmethods`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((response) => setAvailablePaymentMethods(response.data))
            .catch((error) => {
                console.error('Error fetching payment methods:', error);
                toast.error('Error fetching payment methods.');
            });
    }, []);

    // Clear report data when report period type changes
    useEffect(() => {
        setReportData([]);
    }, [reportPeriodType]);

    // Helper function to safely format currency values
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
    };

    // Fetch report data when the "Generate Report" button is clicked
    const fetchReportData = () => {
        // Input validation
        if (!reportType) {
            toast.error('Please select a report type.');
            return;
        }
        if (reportPeriodType === 'date_range') {
            if (!startDate || !endDate) {
                toast.error('Please select start and end dates.');
                return;
            }
            if (startDate > endDate) {
                toast.error('Start date cannot be after end date.');
                return;
            }
        } else if (reportPeriodType === 'month') {
            if (!selectedMonth) {
                toast.error('Please select a month.');
                return;
            }
        } else if (reportPeriodType === 'year') {
            if (!selectedYear) {
                toast.error('Please select a year.');
                return;
            }
        } else if (reportPeriodType === 'single_day') {
            if (!selectedDate) {
                toast.error('Please select a date.');
                return;
            }
        }

        setLoading(true);

        // Prepare data for backend
        const reportRequest = {
            report_type: reportType,
            report_period_type: reportPeriodType,
            start_date: startDate ? startDate.toISOString().split('T')[0] : '',
            end_date: endDate ? endDate.toISOString().split('T')[0] : '',
            selected_month: selectedMonth ? selectedMonth.toISOString().split('T')[0].slice(0, 7) : '',
            selected_year: selectedYear ? selectedYear.getFullYear().toString() : '',
            selected_date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            membership_type: membershipType.map((option) => option.value),
            payment_method: paymentMethod.map((option) => option.value),
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/membership-reports`, reportRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId,
                    role: role,
                },
            })
            .then((response) => {
                setReportData(response.data.reportData);
                setLoading(false);
                toast.success('Report generated successfully.');
            })
            .catch((error) => {
                console.error('Error fetching report data:', error);
                const errorMsg = error.response?.data?.message || 'Error fetching report data.';
                toast.error(errorMsg);
                setLoading(false);
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

        // Check for 'revenue' report with 'single_day' period type
        if (reportType === 'revenue' && reportPeriodType === 'single_day') {
            return renderSingleDayRevenueReport();
        }

        switch (reportType) {
            case 'revenue':
                return renderRevenueReport();
            case 'transaction_details':
                return renderTransactionDetailsReport();
            case 'membership_counts':
                return renderMembershipCountsReport();
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
                        // Convert total_revenue to a number
                        const revenue = parseFloat(item.total_revenue || 0);

                        // Handle cases where revenue is not a valid number
                        const formattedRevenue = isNaN(revenue) ? 'N/A' : revenue.toFixed(2);

                        return (
                            <tr key={index}>
                                <td>{formatDateLabel(item.date)}</td>
                                <td>{formatCurrency(revenue)}</td>
                            </tr>
                        );
                    })}
                    {/* Total Revenue Row */}
                    <tr>
                        <td>
                            <strong>Total Revenue</strong>
                        </td>
                        <td>
                            <strong>{formatCurrency(totalRevenue)}</strong>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </>
        );
    };

    // Function to render revenue report for 'single_day' period type
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
                    subtotal: 0,
                    tax: 0,
                    total_amount: 0,
                };
            }
            const membershipPrice = parseFloat(item.membership_price || 0);
            transactions[item.transaction_id].items.push({
                type_of_membership: item.type_of_membership,
                membership_price: membershipPrice,
            });
            transactions[item.transaction_id].subtotal += membershipPrice;
        });

        // Calculate tax and total_amount for each transaction
        Object.values(transactions).forEach((transaction) => {
            // Assuming tax rate is 10%
            const taxRate = 0.10;
            transaction.tax = transaction.subtotal * taxRate;
            transaction.total_amount = transaction.subtotal + transaction.tax;
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
                        <th>Memberships</th>
                        <th>Subtotal</th>
                        <th>Tax</th>
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
                                        <strong>{capitalizeFirstLetter(item.type_of_membership)}</strong>
                                        <br />
                                        Price: {formatCurrency(item.membership_price)}
                                        <br />
                                    </div>
                                ))}
                            </td>
                            <td>{formatCurrency(transaction.subtotal)}</td>
                            <td>{formatCurrency(transaction.tax)}</td>
                            <td>{formatCurrency(transaction.total_amount)}</td>
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
                    <th>Membership Type</th>
                    <th>Price</th>
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
                        <td>{capitalizeFirstLetter(item.type_of_membership)}</td>
                        <td>{formatCurrency(item.membership_price)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const renderMembershipCountsReport = () => {
        return (
            <>
                <table className={styles.reportTable}>
                    <thead>
                    <tr>
                        <th>{getDateLabel()}</th>
                        <th>New Memberships</th>
                        <th>Canceled Memberships</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reportData.map((item, index) => (
                        <tr key={index}>
                            <td>{formatDateLabel(item.date)}</td>
                            <td>{item.new_memberships}</td>
                            <td>{item.canceled_memberships}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>
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
            return dateObj.toLocaleDateString();
        } else if (reportPeriodType === 'year') {
            // dateStr is 'YYYY-MM'
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

    // Helper function to capitalize the first letter
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Function to generate PDF of the report
    const generatePDF = () => {
        try {
            const doc = new jsPDF();

            if (reportType === 'revenue' && reportPeriodType === 'single_day') {
                doc.text('Membership Revenue Report - Single Day', 14, 20);

                // Group transactions by transaction ID
                const transactions = {};
                reportData.forEach((item) => {
                    if (!transactions[item.transaction_id]) {
                        transactions[item.transaction_id] = {
                            transaction_id: item.transaction_id,
                            transaction_date: new Date(item.transaction_date).toLocaleString(),
                            username: item.username,
                            transaction_type: item.transaction_type,
                            payment_status: item.payment_status,
                            items: [],
                            subtotal: 0,
                            tax: 0,
                            total_amount: 0,
                        };
                    }

                    // Add item and update totals
                    const membershipPrice = parseFloat(item.membership_price || 0);
                    transactions[item.transaction_id].items.push({
                        type_of_membership: item.type_of_membership,
                        membership_price: membershipPrice,
                    });
                    transactions[item.transaction_id].subtotal += membershipPrice;
                });

                // Calculate tax and total_amount for each transaction
                Object.values(transactions).forEach((transaction) => {
                    // Assuming tax rate is 10%
                    const taxRate = 0.10;
                    transaction.tax = transaction.subtotal * taxRate;
                    transaction.total_amount = transaction.subtotal + transaction.tax;
                });

                // Create table body
                const body = Object.values(transactions).map((trans) => [
                    trans.transaction_id,
                    trans.transaction_date,
                    trans.username,
                    trans.transaction_type,
                    trans.payment_status,
                    // Format items details
                    trans.items
                        .map(
                            (item) =>
                                `${capitalizeFirstLetter(item.type_of_membership)}\nPrice: ${formatCurrency(
                                    item.membership_price
                                )}`
                        )
                        .join('\n\n'),
                    formatCurrency(trans.subtotal),
                    formatCurrency(trans.tax),
                    formatCurrency(trans.total_amount),
                ]);

                // Calculate grand total
                const grandTotal = Object.values(transactions).reduce(
                    (sum, trans) => sum + (parseFloat(trans.total_amount) || 0),
                    0
                );

                // Add footer row with total
                body.push(['', '', '', '', '', 'Total:', '', '', formatCurrency(grandTotal)]);

                doc.autoTable({
                    head: [
                        [
                            'Trans ID',
                            'Date',
                            'User',
                            'Payment',
                            'Status',
                            'Memberships',
                            'Subtotal',
                            'Tax',
                            'Total',
                        ],
                    ],
                    body: body,
                    startY: 30,
                    styles: { fontSize: 8 },
                    columnStyles: {
                        0: { cellWidth: 15 }, // Trans ID
                        1: { cellWidth: 35 }, // Date
                        2: { cellWidth: 15 }, // User
                        3: { cellWidth: 17 }, // Payment
                        4: { cellWidth: 20 }, // Status
                        5: { cellWidth: 60 }, // Memberships
                        6: { cellWidth: 25 }, // Subtotal
                        7: { cellWidth: 25 }, // Tax
                        8: { cellWidth: 25 }, // Total
                    },
                    headStyles: { fillColor: [66, 139, 202] },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                });
            } else if (reportType === 'revenue') {
                doc.text('Membership Revenue Report', 14, 20);
                let body = reportData.map((item) => {
                    const revenue = parseFloat(item.total_revenue || 0);
                    const formattedRevenue = isNaN(revenue) ? 'N/A' : revenue.toFixed(2);
                    const dateLabel = formatDateLabel(item.date);
                    return [dateLabel, formatCurrency(revenue)];
                });

                // Add total revenue row
                const totalRevenue = reportData.reduce(
                    (acc, curr) => acc + parseFloat(curr.total_revenue || 0),
                    0
                );
                body.push(['Total Revenue', formatCurrency(totalRevenue)]);

                doc.autoTable({
                    head: [[getDateLabel(), 'Total Revenue']],
                    body: body,
                    startY: 30,
                });
            } else if (reportType === 'transaction_details') {
                doc.text('Membership Transaction Details Report', 14, 20);

                let body = reportData.map((item) => {
                    return [
                        item.transaction_id,
                        new Date(item.transaction_date).toLocaleString(),
                        item.username,
                        item.transaction_type,
                        item.payment_status,
                        capitalizeFirstLetter(item.type_of_membership),
                        formatCurrency(item.membership_price),
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
                            'Membership Type',
                            'Price',
                        ],
                    ],
                    body: body,
                    startY: 30,
                    styles: { fontSize: 8 },
                });
            } else if (reportType === 'membership_counts') {
                doc.text('Membership Counts Report', 14, 20);

                let body = reportData.map((item) => {
                    const dateLabel = formatDateLabel(item.date);
                    return [dateLabel, item.new_memberships, item.canceled_memberships];
                });

                doc.autoTable({
                    head: [[getDateLabel(), 'New Memberships', 'Canceled Memberships']],
                    body: body,
                    startY: 30,
                });
            }

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            doc.save(`membership_${reportType}_${reportPeriodType}_${timestamp}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Error generating PDF.');
        }
    };

    return (
        <div className={styles.reportContainer}>
            <HomeNavBar />
            <h1 className={styles.title}>Membership Report</h1>
            <div className={styles.filterContainer}>
                <div className={styles.formGroup}>
                    <label htmlFor="reportType">Report Type:</label>
                    <select
                        id="reportType"
                        value={reportType}
                        onChange={(e) => {
                            setReportType(e.target.value);
                            setMembershipType([]);
                            setPaymentMethod([]);
                            setReportData([]);
                        }}
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="transaction_details">Transaction Details Report</option>
                        <option value="membership_counts">Membership Counts Report</option>
                    </select>
                </div>
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
                            }}
                        >
                            Single Day
                        </button>
                    </div>
                </div>

                {(reportType === 'revenue' || reportType === 'transaction_details') && (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="membershipType">Membership Type:</label>
                            <Select
                                isMulti
                                id="membershipType"
                                value={membershipType}
                                onChange={(selectedOptions) => {
                                    setMembershipType(selectedOptions || []);
                                    setReportData([]);
                                }}
                                options={availableMembershipTypes.map((type) => ({
                                    value: type.type_of_membership,
                                    label: capitalizeFirstLetter(type.type_of_membership),
                                }))}
                                className={styles.multiSelect}
                                placeholder="Select Membership Types..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="paymentMethod">Payment Method:</label>
                            <Select
                                isMulti
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(selectedOptions) => {
                                    setPaymentMethod(selectedOptions || []);
                                    setReportData([]);
                                }}
                                options={availablePaymentMethods.map((method) => ({
                                    value: method.transaction_type,
                                    label: method.transaction_type,
                                }))}
                                className={styles.multiSelect}
                                placeholder="Select Payment Methods..."
                            />
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

                <button
                    className={styles.generateButton}
                    onClick={handleGenerateReport}
                    disabled={loading}
                >
                    {loading ? 'Generating Report...' : 'Generate Report'}
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

export default MembershipReport;
