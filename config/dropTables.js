const connection = require('./database');  // Import your database connection

const dropTables = [
    'DROP TABLE IF EXISTS Returning_Items',
    'DROP TABLE IF EXISTS Feedbacks',
    'DROP TABLE IF EXISTS Bills',
    'DROP TABLE IF EXISTS Discounts',
    'DROP TABLE IF EXISTS Rental_details',
    'DROP TABLE IF EXISTS Rentals',
    'DROP TABLE IF EXISTS Payments',
    'DROP TABLE IF EXISTS Items',
    'DROP TABLE IF EXISTS Categories',
    'DROP TABLE IF EXISTS Users',
    'DROP TABLE IF EXISTS Roles'
];

dropTables.forEach((query, index) => {
    connection.query(query, (err, results) => {
        if (err) {
            console.error(`Error dropping table at index ${index}:`, err);
            return;
        }
        console.log(`Table at index ${index} dropped successfully!`);
    });
});
connection.end();  // Close the connection after executing the queries
