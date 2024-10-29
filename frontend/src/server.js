import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 6000; // CHANGE FOR U THEN WHEN U PUSH TO GITHUB CHANGE BACK TO 6000
app.use(cors({
    origin: 'http://localhost:3002' // CHANGE FOR U THEN WHEN U PUSH TO GITHUB CHANGE BACK TO 3002
}));
app.use(express.json());
app.use(express.static('public')); // allows access to the public folder for images


// ----- DATABASE CONNECTION ----------------------------------------------------------------------
const db = mysql.createConnection({ // we can add the env file later so this data is not exposed
    host: 'museumcosc3380.mysql.database.azure.com',
    user: 'Melanie',
    password: 'StrongPassword123',
    database: 'Museum'
});
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});
// ------------------------------------------------------------------------------------------------

// ----- MULTER: IMAGE UPLOAD ---------------------------------------------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, safeFileName);
    }
});
const upload = multer({storage});
// ------------------------------------------------------------------------------------------------

// ----- API CALLS -----------------------------------------------------------------------------------------------------------

// ----- (MELANIE) -------------------------------------------------------------------------------------

// query artwork table
app.get('/artwork', (req, res) => {
    const sql = 'SELECT * FROM artwork';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching artwork table" });
        return res.json(result);
    });
});

// query departments table
app.get('/department', (req, res) => {
    const sql = 'SELECT * FROM department';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching department table" });
        return res.json(result);
    });
});

// query artist table
app.get('/artist', (req, res) => {
    const sql = 'SELECT * FROM artist';
    db.query(sql, (err, result) => {
        if (err) return res.json({ message: "Error fetching artist table" });
        return res.json(result);
    });
});

// ----- (MELANIE DONE) --------------------------------------------------------------------------------

// ----- (LEO) -----------------------------------------------------------------------------------------

// ----- (LEO DONE) ------------------------------------------------------------------------------------

// ----- (MUNA) ----------------------------------------------------------------------------------------

// ----- (MUNA DONE) -----------------------------------------------------------------------------------

// ----- (TYLER) ---------------------------------------------------------------------------------------

// ----- (TYLER DONE) ----------------------------------------------------------------------------------

// ----- (DENNIS) --------------------------------------------------------------------------------------

// ----- (DENNIS DONE) ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});
