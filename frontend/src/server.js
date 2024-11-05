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

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRoleId = roleId || 3; // Default to role ID 3 if not provided
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

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const [user] = await db.query(`
            SELECT users.*, roles.role_name,
            (users.role_id = 4) as is_member
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.username = ?
        `, [username]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Update the updated_at timestamp
        await db.query(
            'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
            [user[0].user_id]
        );

        // Check membership warning ONLY if user is a member
        let membershipInfo = null;
        if (user[0].is_member) {
            const [warning] = await db.query(
                `SELECT expiration_warning, expire_date 
                 FROM membership 
                 WHERE user_id = ? 
                 AND expire_date >= CURRENT_TIMESTAMP
                 ORDER BY expire_date ASC 
                 LIMIT 1`,
                [user[0].user_id]
            );
            membershipInfo = warning[0];
        }

        res.status(200).json({
            message: 'Login successful!',
            userId: user[0].user_id,
            role: user[0].role_name,
            username: user[0].username,
            membershipWarning: membershipInfo?.expiration_warning === 1,
            expireDate: membershipInfo?.expire_date
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// ----- AUTHENTICATION MIDDLEWARE -----
function authenticateAdmin(req, res, next) {
    const { role } = req.headers;
    if (role === 'admin' || role === 'staff') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}

// Authenticate User Middleware
function authenticateUser(req, res, next) {
    const userId = req.headers['user-id'];
    const role = req.headers['role'];

    if (userId && role) {
        req.userId = userId;
        req.userRole = role;
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized access.' });
    }
}

// ----- MULTER CONFIGURATION -----
const uploadMulter = multer({ storage: multer.memoryStorage() });

// ----- GIFT SHOP ITEMS ENDPOINTS -----

// Create item API
app.post('/giftshopitems', upload.single('image'), async (req, res) => {
    const { name_, category, price, quantity } = req.body;
    const imageBlob = req.file ? req.file.buffer : null;

    try {
        const sql = `
            INSERT INTO giftshopitem (name_, category, price, quantity, image)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [name_, category, parseFloat(price), quantity, imageBlob];

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
        res.json(rows);
    } catch (error) {
        console.error('Error fetching gift shop items:', error);
        res.status(500).json({ message: 'Server error fetching gift shop items.' });
    }
});

// Get all gift shop items (including deleted, admin only)
app.get('/giftshopitemsall', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT item_id, name_, category, price, quantity, is_deleted FROM giftshopitem');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching gift shop items:', error);
        res.status(500).json({ message: 'Server error fetching gift shop items.' });
    }
});

// Get image for a specific gift shop item
app.get('/giftshopitems/:id/image', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query('SELECT image FROM giftshopitem WHERE item_id = ?', [id]);
        if (rows.length === 0 || !rows[0].image) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        res.set('Content-Type', 'image/jpeg'); // Adjust content type as needed
        res.send(rows[0].image);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ message: 'Server error fetching image.' });
    }
});

// Update item API
app.put('/giftshopitems/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name_, category, price, quantity } = req.body;
    const imageBlob = req.file ? req.file.buffer : null;

    try {
        const sql = `
            UPDATE giftshopitem
            SET name_ = ?,
                category = ?,
                price = ?,
                quantity = ?,
                image = ?
            WHERE item_id = ?
              AND is_deleted = 0
        `;
        const values = [name_, category, parseFloat(price), quantity, imageBlob, id];

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
            WHERE user_id = ?
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

// Update user profile
app.put('/users/:id', authenticateUser, async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth, email } = req.body;

    // Ensure the user can only update their own profile or admin can update any
    if (req.userId !== id && req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const sql = `
            UPDATE users
            SET first_name = ?,
                last_name = ?,
                date_of_birth = ?,
                email = ?
            WHERE user_id = ?
        `;
        const values = [firstName, lastName, dateOfBirth, email, id];

        await db.query(sql, values);
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error updating user profile.' });
    }
});

// ----- CHECKOUT ENDPOINT ------------------------------------------------------------------------

app.post('/checkout', authenticateUser, async (req, res) => {
    const { payment_method, items } = req.body;
    const user_id = req.userId; // Retrieved from the authenticateUser middleware

    // Input Validation
    if (!payment_method || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid request. payment_method and items are required.' });
    }

    for (let item of items) {
        if (!item.item_id || !item.quantity || item.quantity <= 0) {
            return res.status(400).json({ message: 'Each item must have a valid item_id and quantity greater than 0.' });
        }
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch item details with row locking to prevent race conditions
        const itemIds = items.map(item => item.item_id);
        const [dbItems] = await connection.query(
            `SELECT item_id, price, quantity
             FROM giftshopitem
             WHERE item_id IN (?) AND is_deleted = 0
                 FOR UPDATE`,
            [itemIds]
        );

        // Check if all items exist
        if (dbItems.length !== items.length) {
            throw new Error('One or more items do not exist or have been deleted.');
        }

        // Check for sufficient inventory and prepare transaction items
        let calculatedSubtotal = 0;
        const transactionItems = [];

        for (let cartItem of items) {
            const dbItem = dbItems.find(item => item.item_id === cartItem.item_id);
            if (dbItem.quantity < cartItem.quantity) {
                throw new Error(`Insufficient quantity for item '${dbItem.item_id}'. Available: ${dbItem.quantity}, Requested: ${cartItem.quantity}.`);
            }
            const itemSubtotal = parseFloat((cartItem.quantity * dbItem.price).toFixed(2));
            calculatedSubtotal += itemSubtotal;
            transactionItems.push({
                item_id: cartItem.item_id,
                quantity: cartItem.quantity,
                price_at_purchase: dbItem.price,
                subtotal: itemSubtotal
            });
        }

        calculatedSubtotal = parseFloat(calculatedSubtotal.toFixed(2));
        const taxRate = 0.0825; // 8.25% tax
        const calculatedTax = parseFloat((calculatedSubtotal * taxRate).toFixed(2));
        const calculatedTotal = parseFloat((calculatedSubtotal + calculatedTax).toFixed(2));

        // Insert into transaction table
        const [transactionResult] = await connection.query(
            `INSERT INTO \`transaction\` (transaction_date, subtotal, tax, total_amount, transaction_type, user_id, payment_status)
             VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
            [calculatedSubtotal, calculatedTax, calculatedTotal, payment_method, user_id, 'completed']
        );
        const transactionId = transactionResult.insertId;

        // Insert into transaction_giftshopitem table
        const transactionItemsValues = transactionItems.map(item => [
            transactionId,
            item.item_id,
            item.quantity,
            item.price_at_purchase
        ]);

        await connection.query(
            `INSERT INTO \`transaction_giftshopitem\` (transaction_id, item_id, quantity, price_at_purchase)
             VALUES ?`,
            [transactionItemsValues]
        );

        // Update giftshopitem quantities
        for (let cartItem of items) {
            await connection.query(
                `UPDATE giftshopitem
                 SET quantity = quantity - ?
                 WHERE item_id = ?`,
                [cartItem.quantity, cartItem.item_id]
            );
        }

        // Commit the transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Checkout successful.',
            transaction_id: transactionId,
            total_amount: calculatedTotal
        });

    } catch (error) {
        await connection.rollback();
        console.error('Checkout Error:', error.message);
        res.status(400).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
});

// Reports Endpoint
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

// ------------------------------------------------------------------------------------------------

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

// Fetch report data for a specific event
app.get('/api/events/:id/report', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('SELECT EventName, TotalMembersSignedUp, TotalCashRevenue FROM EventReport WHERE EventID = ?', 
            [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: 'Report not found for the specified event.' });
        }
        res.json(result[0]);
    }
    catch (error){
        console.error('Error fetching event report:', error);
        res.status(500).json({ message: 'Server error fetching event report.' });
    }
})

// ----- (TYLER DONE) ---------------------------------------------------------------------------------

// ----- (DENNIS) ---------------------------------------------------------------------------------
// Altered Leo's login backend to accomodate for membership expiration alert trigger
// (Assuming DENNIS's endpoints are already correctly implemented)
// ----- (DENNIS DONE) ----------------------------------------------------------------------------

// Start the server
app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});

