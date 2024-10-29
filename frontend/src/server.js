// server.js

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();
const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: true },
    connectTimeout: 10000,
});
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("Database connection successful");
        connection.release();
    } catch (error) {
        console.error("Database connection error:", error);
    }
})();
// Registration Route
app.post('/register', async (req, res) => {
    const {firstName, lastName, dateOfBirth, username, password, email, roleId} = req.body;

    const newErrors = {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!username) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    if (!email) newErrors.email = 'Email is required';

    if (Object.keys(newErrors).length > 0) {
        return res.status(400).json({message: 'Validation error', errors: newErrors});
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const assignedRoleId = roleId || 3;
        const sql = `
            INSERT INTO users (first_name, last_name, date_of_birth, username, password, email, role_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [firstName, lastName, dateOfBirth, username, hashedPassword, email, assignedRoleId];

        await db.query(sql, values);
        res.status(201).json({message: 'User registered successfully.'});
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({message: 'Server error during registration.'});
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: 'Username and password are required.'});
    }

    try {
        const [user] = await db.query(`
            SELECT users.*, roles.role_name
            FROM users
                     JOIN roles ON users.role_id = roles.id
            WHERE users.username = ?`, [username]);

        if (user.length === 0) {
            return res.status(400).json({message: 'Invalid username or password.'});
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(400).json({message: 'Invalid username or password.'});
        }

        res.status(200).json({
            message: 'Login successful!',
            userId: user[0].id,
            role: user[0].role_name,
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({message: 'Server error.'});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
