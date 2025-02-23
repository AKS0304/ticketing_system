const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Default MySQL username
    password: "",  // Leave empty if no password (or add your password)
    database: "ticketing_system"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        return;
    }
    console.log("Connected to MySQL database!");
});

module.exports = db;
