const connection = require('./database');  // Import your database connection

const truncateTables = [
    'SET FOREIGN_KEY_CHECKS = 0',  // Temporarily disable foreign key checks
    'TRUNCATE TABLE Returning_Items',
    'TRUNCATE TABLE Feedbacks',
    'TRUNCATE TABLE Bills',
    'TRUNCATE TABLE Payments',
    'TRUNCATE TABLE Rental_details',
    'TRUNCATE TABLE Rentals',
    'TRUNCATE TABLE Items',
    'TRUNCATE TABLE Categories',
    'TRUNCATE TABLE Users',
    'TRUNCATE TABLE Roles',
    'SET FOREIGN_KEY_CHECKS = 1'  // Re-enable foreign key checks
];

truncateTables.forEach((query, index) => {
    connection.query(query, (err, results) => {
        if (err) {
            console.error(`Error truncating table at index ${index}:`, err);
            return;
        }
        console.log(`Table at index ${index} truncated successfully!`);
    });
});

connection.end();  // Close the connection after executing the queries
