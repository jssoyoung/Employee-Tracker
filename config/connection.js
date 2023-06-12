const mysql = require('mysql2');
require("dotenv").config();

// Connects to mysql database
const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Error if it isn't connected to mysql database
connection.connect(function (err) {
    if (err) throw err;
  });
  
  module.exports = connection;