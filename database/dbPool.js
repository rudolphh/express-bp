require('dotenv').config({ path: '../.env'});
const mysql = require('mysql2/promise');

// using environment variables injected from .env file
// create a connection pool to the mysql server
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    // in case different from mysql default 3306
    // port: process.env.DB_PORT, 
});


module.exports = pool;