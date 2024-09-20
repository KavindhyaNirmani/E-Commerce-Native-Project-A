//config store configuration settings

//db define connection to the mysql database.

const mysql= require('mysql2');
require('dotenv').config();

const pool= mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

// Use promise-based API for async/await support
const promisePool = pool.promise();


module.exports=pool.promise();
