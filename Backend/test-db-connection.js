// test-db-connection.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database.');

    // Perform a simple query to test the connection
    connection.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('Error performing query:', err.message);
            return;
        }
        console.log('Query result:', results[0].solution);
        connection.end();
    });
});
