const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' }); 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

connection.connect((err) => {
  if (err) {
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;

