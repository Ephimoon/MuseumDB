const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();
const port = 6000; // Change to 6000 when you push to GitHub
app.use(cors({
    origin: 'http://localhost:3002' // Change to 3002 when you push to GitHub
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
    queueLimit: 0
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
app.get('/artwork', (req, res) => {
    const sql = 'SELECT * FROM artwork';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching artwork table" });
        return res.json(result);
    });
});

// Query departments table
app.get('/department', (req, res) => {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching department table" });
        return res.json(result);
    });
});

// Query artist table
app.get('/artist', (req, res) => {
    const sql = 'SELECT * FROM artist';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching artist table" });
        return res.json(result);
    });
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
            SELECT users.*, roles.role_name
            FROM users
            JOIN roles ON users.role_id = roles.id
            WHERE users.username = ?`, [username]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        res.status(200).json({
            message: 'Login successful!',
            userId: user[0].id,
            role: user[0].role_name,
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// ----- (LEO DONE) --------------------------------------------------------------------------------

// ----- (MUNA) ------------------------------------------------------------------------------------

// ----- (MUNA DONE) ------------------------------------------------------------------------------

// ----- (TYLER) ----------------------------------------------------------------------------------

// ----- (TYLER DONE) -----------------------------------------------------------------------------

// ----- (DENNIS) ---------------------------------------------------------------------------------

// ----- (DENNIS DONE) ----------------------------------------------------------------------------

// Start the server
app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
