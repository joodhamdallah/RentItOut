const connection = require('./database');  // Import your database connection

const dropTables = [

    'DROP TABLE IF EXISTS Feedbacks',         // Depends on Rentals, Users
    'DROP TABLE IF EXISTS Bills',             // Depends on Rentals, Payments
    'DROP TABLE IF EXISTS Returning_Items',   // Depends on Rental_details, Items
    'DROP TABLE IF EXISTS Rental_details',    // Depends on Rentals, Items
    'DROP TABLE IF EXISTS Rentals',           // Depends on Users, Discounts
    'DROP TABLE IF EXISTS Discounts',         // No dependencies
    'DROP TABLE IF EXISTS Payments',          // No dependencies
    'DROP TABLE IF EXISTS Items',             // Depends on Categories, Users
    'DROP TABLE IF EXISTS Categories',        // No dependencies
    'DROP TABLE IF EXISTS Users',             // Depends on Roles
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
