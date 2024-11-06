// src/pages/Report.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/Report.module.css';
import HomeNavBar from '../components/HomeNavBar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from '../config';

const Report = () => {
    const [reportCategory, setReportCategory] = useState('GiftShopReport');
    const [reportType, setReportType] = useState('revenue');
    const [reportPeriodType, setReportPeriodType] = useState('date_range'); // 'date_range', 'month', or 'year'
    const [startDate, setStartDate] = useState(null); // Changed to Date object
    const [endDate, setEndDate] = useState(null); // Changed to Date object
    const [selectedMonth, setSelectedMonth] = useState(null); // Changed to Date object
    const [selectedYear, setSelectedYear] = useState(null); // Changed to Date object
    const [itemCategory, setItemCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [itemId, setItemId] = useState('');
    const [availableItems, setAvailableItems] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch available options for the filters when reportType is 'revenue'
    useEffect(() => {
        if (reportType === 'revenue') {
            // Fetch available items
            axios
                .get(`${config.backendUrl}/giftshopitems`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => setAvailableItems(response.data))
                .catch((error) => console.error('Error fetching items:', error));

            // Fetch available categories
            axios
                .get(`${config.backendUrl}/giftshopcategories`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => setAvailableCategories(response.data))
                .catch((error) => console.error('Error fetching categories:', error));

            // Fetch available payment methods
            axios
                .get(`${config.backendUrl}/paymentmethods`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => setAvailablePaymentMethods(response.data))
                .catch((error) => console.error('Error fetching payment methods:', error));
        }
    }, [reportType]);

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
        }

        setErrorMessage('');
        setLoading(true);

        // Prepare data for backend
        const reportRequest = {
            report_category: reportCategory,
            report_type: reportType,
            report_period_type: reportPeriodType,
            start_date: startDate ? startDate.toISOString().split('T')[0] : '',
            end_date: endDate ? endDate.toISOString().split('T')[0] : '',
            selected_month: selectedMonth ? selectedMonth.toISOString().split('T')[0].slice(0, 7) : '',
            selected_year: selectedYear ? selectedYear.getFullYear().toString() : '',
            item_category: itemCategory,
            payment_method: paymentMethod,
            item_id: itemId,
        };

        // Retrieve user credentials from localStorage
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');

        axios
            .post(`${config.backendUrl}/reports`, reportRequest, {
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

        switch (reportType) {
            case 'revenue':
                return renderRevenueReport();
            // Add other report types if needed
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

    // Helper functions to get and format date labels
    const getDateLabel = () => {
        if (reportPeriodType === 'month' || reportPeriodType === 'date_range') {
            return 'Date';
        } else if (reportPeriodType === 'year') {
            return 'Month';
        }
        return 'Date';
    };

    const formatDateLabel = (dateStr) => {
        if (reportPeriodType === 'month' || reportPeriodType === 'date_range') {
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

        doc.save('revenue_report.pdf');
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
                        {/* Only revenue report is available as per your request */}
                        <option value="revenue">Revenue Report</option>
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
                    </div>
                </div>

                {reportType === 'revenue' && (
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
