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
app.use(express.static('public'));


// database connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'image_test_schema'
// });
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the MySQL database');
// });


// // multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images')
//     },
//     filename: (req, file, cb) => {
//         const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
//         cb(null, safeFileName);
//     }
// });
// const upload = multer({storage});

// all api calls ---------------



// ------------------------------

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`);
});