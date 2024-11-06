// server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
const port = 5000; // Change to 6000 when you push to GitHub

const allowedOrigins = [
    'http://localhost:3000', // Local development frontend
    'http://localhost:3002', // Updated localhost port if needed
    'https://black-desert-0587dbd10.5.azurestaticapps.net/' // Replace with your Azure Static Web App URL
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Enables credentials if you plan on using them
}));

app.use(express.json());
app.use(express.static('public')); // Allows access to the public folder for images

// ----- DATABASE CONNECTION ----------------------------------------------------------------------
const db = mysql.createPool({ // We can add the env file later so this data is not exposed
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
});
db.getConnection()
    .then(() => console.log('Connected to the MySQL database'))
    .catch((err) => console.error('Error connecting to the database:', err));
// ------------------------------------------------------------------------------------------------

// ----- MULTER: IMAGE UPLOAD ---------------------------------------------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, safeFileName);
    }
});
const upload = multer({ storage });
// ------------------------------------------------------------------------------------------------

// ----- ROLE MAPPINGS -----------------------------------------------------------------------------
const roleMappings = {
    1: 'admin',
    2: 'staff',
    3: 'customer',
    4: 'member',
};
// ------------------------------------------------------------------------------------------------

// ----- API CALLS --------------------------------------------------------------------------------

// ----- (MELANIE) --------------------------------------------------------------------------------

// Query artwork table
app.get('/artwork', async (req, res) => {
    const sql = 'SELECT * FROM artwork';
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        console.error('Error fetching artwork:', err);
        res.status(500).json({ message: "Error fetching artwork table" });
    }
});

// Query departments table
app.get('/department', async (req, res) => {
    const sql = 'SELECT * FROM department';
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        console.error('Error fetching department:', err);
        res.status(500).json({ message: "Error fetching department table" });
    }
});

// Query artist table
app.get('/artist', async (req, res) => {
    const sql = 'SELECT * FROM artist';
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        console.error('Error fetching artist:', err);
        res.status(500).json({ message: "Error fetching artist table" });
    }
});

// ----- (MELANIE DONE) ---------------------------------------------------------------------------

// ----- (LEO) ------------------------------------------------------------------------------------

// User registration
app.post('/register', async (req, res) => {
    const { firstName, lastName, dateOfBirth, username, password, email, roleId } = req.body;

    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (!email) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
        return res.status(400).json({ message: 'Validation error', errors: newErrors });
    }

    // Assign default role_id if not provided
    const assignedRoleId = roleId || 3; // Default to 'customer' if roleId is not provided

    // Validate roleId
    if (!Object.keys(roleMappings).includes(String(assignedRoleId))) {
        return res.status(400).json({ message: 'Invalid role_id provided.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO users (first_name, last_name, date_of_birth, username, password, email, role_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [firstName, lastName, dateOfBirth, username, hashedPassword, email, assignedRoleId];

        await db.query(sql, values);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const [userRows] = await db.query(`
            SELECT user_id, username, password, role_id, is_deleted
            FROM users
            WHERE username = ?
        `, [username]);

        if (userRows.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const user = userRows[0];

        // Check if user is deleted
        if (user.is_deleted === 1) {
            return res.status(403).json({ message: 'Account has been deactivated. Please contact support.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Map role_id to role_name
        const roleName = roleMappings[user.role_id] || 'unknown';

        res.status(200).json({
            message: 'Login successful!',
            userId: user.user_id,
            role: roleName,
            username: user.username,
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});
// ----- AUTHENTICATION MIDDLEWARE -----

// Authenticate Admin and Staff Middleware
function authenticateAdmin(req, res, next) {
    const { role } = req.headers;
    if (role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}

async function authenticateUser(req, res, next) {
    const userId = req.headers['user-id'];
    const role = req.headers['role'];

    if (userId && role) {
        try {
            const [rows] = await db.query('SELECT is_deleted FROM users WHERE user_id = ?', [userId]);
            if (rows.length > 0 && rows[0].is_deleted === 0) {
                req.userId = userId;
                req.userRole = role;
                next();
            } else {
                res.status(403).json({ message: 'Access denied. User is deleted.' });
            }
        } catch (error) {
            console.error('Error in authenticateUser middleware:', error);
            res.status(500).json({ message: 'Server error during authentication.' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized access.' });
    }
}


// ----- MULTER CONFIGURATION -----
const uploadMulter = multer({ storage: multer.memoryStorage() });

// ----- GIFT SHOP ITEMS ENDPOINTS -----

// Create item API
app.post('/giftshopitems', uploadMulter.single('image'), async (req, res) => {
    const { name_, category, price, quantity } = req.body;
    const imageBlob = req.file ? req.file.buffer : null;
    const imageType = req.file ? req.file.mimetype : null;

    try {
        const sql = `
            INSERT INTO giftshopitem (name_, category, price, quantity, image, image_type)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            name_,
            category,
            parseFloat(price),
            parseInt(quantity, 10),
            imageBlob,
            imageType
        ];
        // No cache
        res.set('Cache-Control', 'no-store');
        await db.query(sql, values);
        res.status(201).json({ message: 'Item created successfully' });
    } catch (error) {
        console.error('Error creating gift shop item:', error);
        res.status(500).json({ error: 'Failed to create gift shop item' });
    }
});

// Get all gift shop items (non-deleted)
app.get('/giftshopitems', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT item_id, name_, category, price, quantity, is_deleted FROM giftshopitem WHERE is_deleted = 0');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching gift shop items:', error);
        res.status(500).json({ message: 'Server error fetching gift shop items.' });
    }
});

// Get all gift shop items (including deleted, admin only)
app.get('/giftshopitemsall', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT item_id, name_, category, price, quantity, is_deleted FROM giftshopitem');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching gift shop items:', error);
        res.status(500).json({ message: 'Server error fetching gift shop items.' });
    }
});

// Get image for a specific gift shop item
app.get('/giftshopitems/:id/image', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT image, image_type FROM giftshopitem WHERE item_id = ?', [id]);
        if (rows.length === 0 || !rows[0].image) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        const imageType = rows[0].image_type || 'application/octet-stream';
        res.set('Content-Type', imageType);
        res.send(rows[0].image);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Server error fetching image.' });
    }
});

// Update item API
app.put('/giftshopitems/:id', uploadMulter.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name_, category, price, quantity } = req.body;
    const imageBlob = req.file ? req.file.buffer : null;
    const imageType = req.file ? req.file.mimetype : null;

    try {
        let sql, values;

        if (imageBlob && imageType) {
            sql = `
                UPDATE giftshopitem
                SET name_ = ?,
                    category = ?,
                    price = ?,
                    quantity = ?,
                    image = ?,
                    image_type = ?
                WHERE item_id = ?
                  AND is_deleted = 0
            `;
            values = [name_, category, parseFloat(price), quantity, imageBlob, imageType, id];
        } else {
            // If no new image is uploaded, don't update image fields
            sql = `
                UPDATE giftshopitem
                SET name_ = ?,
                    category = ?,
                    price = ?,
                    quantity = ?
                WHERE item_id = ?
                  AND is_deleted = 0
            `;
            values = [name_, category, parseFloat(price), quantity, id];
        }
        res.set('Cache-Control', 'no-store');
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found or already deleted.' });
        }
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating gift shop item:', error);
        res.status(500).json({ error: 'Failed to update gift shop item' });
    }
});

// Hard delete a gift shop item (Admin only)
app.delete('/giftshopitems/:id/hard-delete', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM giftshopitem WHERE item_id = ?';
        const [result] = await db.query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found or already deleted.' });
        }

        res.status(200).json({ message: 'Gift shop item permanently deleted.' });
    } catch (error) {
        console.error('Error hard deleting gift shop item:', error);
        res.status(500).json({ message: 'Server error during hard delete.' });
    }
});

// Soft delete a gift shop item (Admin only)
app.put('/giftshopitems/:id/soft-delete', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'UPDATE giftshopitem SET is_deleted = 1 WHERE item_id = ?';
        await db.query(sql, [id]);
        res.status(200).json({ message: 'Gift shop item marked as deleted.' });
    } catch (error) {
        console.error('Error soft deleting gift shop item:', error);
        res.status(500).json({ message: 'Server error soft deleting gift shop item.' });
    }
});

// Restore a gift shop item (Admin only)
app.put('/giftshopitems/:id/restore', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'UPDATE giftshopitem SET is_deleted = 0 WHERE item_id = ?';
        await db.query(sql, [id]);
        res.status(200).json({ message: 'Gift shop item restored successfully.' });
    } catch (error) {
        console.error('Error restoring gift shop item:', error);
        res.status(500).json({ message: 'Server error restoring gift shop item.' });
    }
});

/// Get all users (Admin only)
app.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT user_id, first_name, last_name, username, email, role_id, is_deleted,
                   DATE_FORMAT(date_of_birth, '%Y-%m-%d') AS date_of_birth
            FROM users
        `);

        // Map role_id to role_name
        const users = rows.map(user => ({
            ...user,
            role_name: roleMappings[user.role_id],
        }));

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
});
// Get user profile
app.get('/users/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;

    // Ensure the user can only access their own profile or admin can access any
    if (req.userId !== id && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const [rows] = await db.query(`
            SELECT first_name AS firstName, last_name AS lastName, date_of_birth AS dateOfBirth, username, email
            FROM users
            WHERE user_id = ? AND is_deleted = 0
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error fetching user data.' });
    }
});
// Update user (Admin only)
app.put('/users/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth, email, roleId } = req.body;

    try {
        const sql = `
            UPDATE users
            SET first_name = ?,
                last_name = ?,
                date_of_birth = ?,
                email = ?,
                role_id = ?
            WHERE user_id = ?
        `;
        const values = [firstName, lastName, dateOfBirth, email, roleId, id];

        await db.query(sql, values);
        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error updating user.' });
    }
});

// Soft delete user (Admin only)
app.put('/users/:id/soft-delete', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'UPDATE users SET is_deleted = 1 WHERE user_id = ?';
        await db.query(sql, [id]);
        res.status(200).json({ message: 'User soft deleted successfully.' });
    } catch (error) {
        console.error('Error soft deleting user:', error);
        res.status(500).json({ message: 'Server error soft deleting user.' });
    }
});

// Hard delete user (Admin only)
app.delete('/users/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM users WHERE user_id = ?';
        await db.query(sql, [id]);
        res.status(200).json({ message: 'User hard deleted successfully.' });
    } catch (error) {
        console.error('Error hard deleting user:', error);
        res.status(500).json({ message: 'Server error hard deleting user.' });
    }
});

// Restore user (Admin only)
app.put('/users/:id/restore', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'UPDATE users SET is_deleted = 0 WHERE user_id = ?';
        await db.query(sql, [id]);
        res.status(200).json({ message: 'User restored successfully.' });
    } catch (error) {
        console.error('Error restoring user:', error);
        res.status(500).json({ message: 'Server error restoring user.' });
    }
});

// ----- CHECKOUT ENDPOINT ------------------------------------------------------------------------
app.put('/users/:id/change-password', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Ensure the user can only change their own password or admin can change any
    if (req.userId !== id && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only change your own password.' });
    }

    try {
        const [rows] = await db.query('SELECT password FROM users WHERE user_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect.' });
        }

        // Additional Validation: Check if newPassword meets criteria (e.g., length)
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, id]);

        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error updating password.' });
    }
});

// ----- CHECKOUT ENDPOINT (Assuming other checkout logic is implemented)
app.post('/checkout', authenticateUser, async (req, res) => {
    // ... Existing checkout logic
});

// ----- REPORTS ENDPOINT ---------------------------------------------------------------------------
app.post('/reports', authenticateAdmin, async (req, res) => {
    const {
        report_category,
        report_type,
        report_period_type, // 'date_range', 'month', or 'year'
        start_date,
        end_date,
        selected_month,
        selected_year, // New field for 'year' report
        item_category,
        payment_method,
        item_id,
    } = req.body;

    console.log('Received /reports request with body:', req.body); // Debug log

    // Input Validation
    if (!report_category || !report_type || !report_period_type) {
        console.error('Validation Error: Missing required fields.');
        return res.status(400).json({
            message:
                'report_category, report_type, and report_period_type are required.',
        });
    }

    // Validate report_period_type and corresponding fields
    if (report_period_type === 'date_range') {
        if (!start_date || !end_date) {
            console.error('Validation Error: Start date and end date are required.');
            return res.status(400).json({
                message: 'Start date and end date are required for date range reports.',
            });
        }
        if (new Date(start_date) > new Date(end_date)) {
            console.error('Validation Error: Start date is after end date.');
            return res.status(400).json({ message: 'Start date cannot be after end date.' });
        }
    } else if (report_period_type === 'month') {
        if (!selected_month) {
            console.error('Validation Error: Selected month is required.');
            return res.status(400).json({
                message: 'Selected month is required for monthly reports.',
            });
        }
    } else if (report_period_type === 'year') {
        if (!selected_year) {
            console.error('Validation Error: Selected year is required.');
            return res.status(400).json({
                message: 'Selected year is required for yearly reports.',
            });
        }
    } else {
        console.error('Invalid report_period_type:', report_period_type);
        return res.status(400).json({ message: 'Invalid report period type.' });
    }

    try {
        let reportData;
        if (report_category === 'GiftShopReport') {
            switch (report_type) {
                case 'revenue':
                    console.log('Generating Gift Shop Revenue Report');
                    reportData = await generateGiftShopRevenueReport(
                        report_period_type,
                        start_date,
                        end_date,
                        selected_month,
                        selected_year,
                        item_category,
                        payment_method,
                        item_id
                    );
                    console.log('Report Data:', reportData); // Debug log
                    break;
                // Add other report types if needed
                default:
                    console.error('Invalid report type:', report_type);
                    return res.status(400).json({ message: 'Invalid report type.' });
            }
        } else {
            console.error('Invalid report category:', report_category);
            return res.status(400).json({ message: 'Invalid report category.' });
        }

        res.status(200).json({ reportData });
    } catch (error) {
        console.error('Error generating report:', error); // Debug log with error details
        res.status(500).json({ message: 'Server error generating report.' });
    }
});

// Updated Function to generate Gift Shop Revenue Report with filters
async function generateGiftShopRevenueReport(
    reportPeriodType,
    startDate,
    endDate,
    selectedMonth,
    selectedYear,
    itemCategory,
    paymentMethod,
    itemId
) {
    let query = '';
    let params = [];

    if (reportPeriodType === 'date_range') {
        // SQL query for date range
        query = `
            SELECT DATE(t.transaction_date) AS date, SUM(tgi.quantity * tgi.price_at_purchase) AS total_revenue
            FROM \`transaction\` t
                JOIN transaction_giftshopitem tgi ON t.transaction_id = tgi.transaction_id
                JOIN giftshopitem gsi ON tgi.item_id = gsi.item_id
            WHERE t.transaction_date >= ? AND t.transaction_date < DATE_ADD(?, INTERVAL 1 DAY)
        `;
        params = [startDate, endDate];
    } else if (reportPeriodType === 'month') {
        // SQL query for month - daily data within the selected month
        query = `
            SELECT DATE(t.transaction_date) AS date, SUM(tgi.quantity * tgi.price_at_purchase) AS total_revenue
            FROM \`transaction\` t
                JOIN transaction_giftshopitem tgi ON t.transaction_id = tgi.transaction_id
                JOIN giftshopitem gsi ON tgi.item_id = gsi.item_id
            WHERE DATE_FORMAT(t.transaction_date, '%Y-%m') = ?
        `;
        params = [selectedMonth];
    } else if (reportPeriodType === 'year') {
        // SQL query for year - monthly data within the selected year
        query = `
            SELECT DATE_FORMAT(t.transaction_date, '%Y-%m') AS date, SUM(tgi.quantity * tgi.price_at_purchase) AS total_revenue
            FROM \`transaction\` t
                JOIN transaction_giftshopitem tgi ON t.transaction_id = tgi.transaction_id
                JOIN giftshopitem gsi ON tgi.item_id = gsi.item_id
            WHERE YEAR(t.transaction_date) = ?
        `;
        params = [selectedYear];
    } else {
        throw new Error('Invalid report period type.');
    }

    // Apply filters if provided
    if (paymentMethod) {
        query += ' AND t.transaction_type = ?';
        params.push(paymentMethod);
    }
    if (itemCategory) {
        query += ' AND gsi.category = ?';
        params.push(itemCategory);
    }
    if (itemId) {
        query += ' AND tgi.item_id = ?';
        params.push(itemId);
    }

    // Group by appropriate time period
    if (reportPeriodType === 'date_range' || reportPeriodType === 'month') {
        query += `
            GROUP BY DATE(t.transaction_date)
            ORDER BY DATE(t.transaction_date)
        `;
    } else if (reportPeriodType === 'year') {
        query += `
            GROUP BY DATE_FORMAT(t.transaction_date, '%Y-%m')
            ORDER BY DATE_FORMAT(t.transaction_date, '%Y-%m')
        `;
    }

    console.log('Executing SQL Query for Revenue Report:', query); // Debug log
    console.log('With Parameters:', params); // Debug log

    try {
        const [rows] = await db.query(query, params);
        console.log('Revenue Report Query Result:', rows); // Debug log
        return rows;
    } catch (error) {
        console.error('Error in generateGiftShopRevenueReport:', error); // Debug log with error details
        throw error;
    }
}

// Endpoint to get all gift shop items
app.get('/giftshopitems', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT item_id, name_ FROM giftshopitem WHERE is_deleted = 0');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching gift shop items:', error);
        res.status(500).json({ message: 'Server error fetching gift shop items.' });
    }
});

// Endpoint to get all gift shop categories
app.get('/giftshopcategories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT category FROM giftshopitem WHERE is_deleted = 0');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching item categories:', error);
        res.status(500).json({ message: 'Server error fetching item categories.' });
    }
});

// Endpoint to get all payment methods used in transactions
app.get('/paymentmethods', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT DISTINCT transaction_type FROM `transaction`');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ message: 'Server error fetching payment methods.' });
    }
});
// Create a new announcement (Admin only)
app.post('/announcements', authenticateUser, async (req, res) => {
    const { title, content, target_audience, priority } = req.body;

    // Only admin can create announcements
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can create announcements.' });
    }

    // Validate inputs
    if (!title || !content || !target_audience || !priority) {
        return res.status(400).json({ message: 'Title, content, target audience, and priority are required.' });
    }

    // Validate target_audience
    const validAudiences = ['staff', 'member', 'customer', 'all'];
    if (!validAudiences.includes(target_audience)) {
        return res.status(400).json({ message: 'Invalid target audience.' });
    }

    // Validate priority
    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' });
    }

    try {
        const sql = `
            INSERT INTO announcements (title, content, target_audience, priority)
            VALUES (?, ?, ?, ?)
        `;
        const values = [title, content, target_audience, priority];
        await db.query(sql, values);
        res.status(201).json({ message: 'Announcement created successfully.' });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Server error creating announcement.' });
    }
});

// Get all announcements (including deleted) for admin
app.get('/announcements/all', authenticateUser, async (req, res) => {
    // Only admins can access this endpoint
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Server error fetching announcements.' });
    }
});

// Get announcements for a user based on their role
app.get('/announcements/user', authenticateUser, async (req, res) => {
    const { userRole } = req;

    try {
        const sql = `
            SELECT * FROM announcements
            WHERE (target_audience = ? OR target_audience = 'all') AND is_active = 1
            ORDER BY created_at DESC
        `;
        const values = [userRole];

        const [rows] = await db.query(sql, values);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching user announcements:', error);
        res.status(500).json({ message: 'Server error fetching announcements.' });
    }
});

// Update an announcement (Admin only)
app.put('/announcements/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { title, content, target_audience, priority } = req.body;

    // Only admin can update announcements
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can update announcements.' });
    }

    // Validate inputs
    if (!title || !content || !target_audience || !priority) {
        return res.status(400).json({ message: 'Title, content, target audience, and priority are required.' });
    }

    // Validate target_audience
    const validAudiences = ['staff', 'member', 'customer', 'all'];
    if (!validAudiences.includes(target_audience)) {
        return res.status(400).json({ message: 'Invalid target audience.' });
    }

    // Validate priority
    const validPriorities = ['high', 'medium', 'low'];
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' });
    }

    try {
        const sql = `
            UPDATE announcements
            SET title = ?, content = ?, target_audience = ?, priority = ?
            WHERE id = ?
        `;
        const values = [title, content, target_audience, priority, id];

        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }

        res.json({ message: 'Announcement updated successfully.' });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ message: 'Server error updating announcement.' });
    }
});

// Soft delete an announcement (Admin only)
app.delete('/announcements/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;

    // Only admin can delete announcements
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can delete announcements.' });
    }

    try {
        const sql = `
            UPDATE announcements
            SET is_active = 0
            WHERE id = ?
        `;
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }

        res.json({ message: 'Announcement deleted successfully.' });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Server error deleting announcement.' });
    }
});

// Restore a soft-deleted announcement (Admin only)
app.put('/announcements/:id/restore', authenticateUser, async (req, res) => {
    const { id } = req.params;

    // Only admin can restore announcements
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can restore announcements.' });
    }

    try {
        const sql = `
            UPDATE announcements
            SET is_active = 1
            WHERE id = ?
        `;
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found.' });
        }

        res.json({ message: 'Announcement restored successfully.' });
    } catch (error) {
        console.error('Error restoring announcement:', error);
        res.status(500).json({ message: 'Server error restoring announcement.' });
    }
});
// ----- (LEO DONE) --------------------------------------------------------------------------------

// ----- (MUNA) ------------------------------------------------------------------------------------

// (Assuming MUNA's endpoints are already correctly implemented)
// ----- (MUNA DONE) ------------------------------------------------------------------------------

// ----- (TYLER) ----------------------------------------------------------------------------------

// Add a new event
app.post('/api/events', async (req, res) => {
    const { name, description, location, status } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO event_ (name_, description_, location, status) VALUES (?, ?, ?, ?)',
            [name, description, location, status]
        )
        res.json({ id: result.insertId, message: 'Event added successfully.' });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ message: 'Server error adding event.' });
    }
});

// Update event information
app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, location, status } = req.body;

    const allowedStatuses = ['upcoming', 'ongoing', 'completed'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE event_ SET name_ = ?, description_ = ?, location = ?, status = ? WHERE event_id = ?',
            [name, description, location, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.json({ message: 'Event updated successfully.' });
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error updating event.' });
    }
})

// Soft delete an event
app.delete('/api/events/:id', async (req, res) => {
    const eventId = req.params.id;
    try {
        const [result] = await db.query('UPDATE event_ SET is_deleted = TRUE WHERE event_id = ?', [eventId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error deleting event.' });
    }
})

// Fetch all non-deleted events from the database
app.get('/api/events', async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM event_ WHERE is_deleted = FALSE');
        res.json(result);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error fetching events.' });
    }
})

// Fetch the total number of members that signed up for an event
app.get('/api/events/:id/members', async (req, res) => {
    const eventId = req.params.id;
    try {
        const [result] = await db.query('SELECT * FROM membership WHERE event_id = ?', [eventId]);
        res.json(result);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Server error fetching members.' });
    }
});

// ----- (TYLER DONE) ---------------------------------------------------------------------------------

// ----- (DENNIS) ---------------------------------------------------------------------------------

// (Assuming DENNIS's endpoints are already correctly implemented)
// ----- (DENNIS DONE) ----------------------------------------------------------------------------

// Start the server
app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
