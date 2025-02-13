const mysql = require('mysql2/promise'); // ✅ Use mysql2/promise
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// ✅ Create a promise-based database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = db; // ✅ No need for .promise() in controllers
