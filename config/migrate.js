const connection = require('./database');  // Import the db connection

const createTables = [
    `CREATE TABLE IF NOT EXISTS Roles (
        role_id INT PRIMARY KEY AUTO_INCREMENT,
        role_name VARCHAR(100),
        role_description TEXT
    );`,
    
    `CREATE TABLE IF NOT EXISTS Users (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        user_name VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        role_id INT,
        phone_number VARCHAR(50),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        address TEXT,
        password_reset_token VARCHAR(255),  
        password_reset_expires DATETIME,
        password_changed_at DATETIME DEFAULT NULL,
        FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS Categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        category_name VARCHAR(255),
        category_description TEXT,
        number_of_items INT
    );`,

    `CREATE TABLE IF NOT EXISTS Items (

    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255),
    item_description TEXT,
    price_per_day DECIMAL(10, 2),
    availability BOOLEAN,
    image_url TEXT,
    category_id INT,
    deposit DECIMAL(10, 2),
    item_count INT DEFAULT 0,  -- New column for counting items
    user_id INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)

 );`,

   `CREATE TABLE IF NOT EXISTS Discounts (
        discount_id INT PRIMARY KEY AUTO_INCREMENT,
        discount_name VARCHAR(255),
        discount_percentage DECIMAL(5, 2) NOT NULL,  -- percentage value for the discount (10.00 for 10%)
        description TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS Rentals (
        rental_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        logistic_type VARCHAR(255),
        discount_id INT,  -- New column for discount_id
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (discount_id) REFERENCES Discounts(discount_id) ON DELETE SET NULL  -- null cuz discount is not always applied
    );`,

    `CREATE TABLE IF NOT EXISTS Rental_details (
        rental_item_id INT PRIMARY KEY AUTO_INCREMENT,
        rental_id INT,
        item_id INT,
        quantity INT,
        rental_date DATE,
        return_date DATE,
        subtotal DECIMAL(10, 2),
        FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES Items(item_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS Payments (
        pay_id INT PRIMARY KEY AUTO_INCREMENT,
        payment_method VARCHAR(255)
    );`,

    `CREATE TABLE IF NOT EXISTS Bills (
        bill_id INT PRIMARY KEY AUTO_INCREMENT,
        total_price DECIMAL(10, 2),
        rental_id INT,
        pay_id INT,
        FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id) ON DELETE CASCADE,
        FOREIGN KEY (pay_id) REFERENCES Payments(pay_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS Feedbacks (
        feedback_id INT PRIMARY KEY AUTO_INCREMENT,
        rental_id INT,
        user_id INT,
        comment TEXT,
        rating INT,
        FOREIGN KEY (rental_id) REFERENCES Rentals(rental_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS Returning_Items (
        RItem_id INT PRIMARY KEY AUTO_INCREMENT,
        item_name VARCHAR(255),
        status_for_item VARCHAR(255),
        returned_amount DECIMAL(10, 2),
        actual_return_date DATE,
        rental_item_id INT,
        overtime_charge DECIMAL(10, 2),
        FOREIGN KEY (rental_item_id) REFERENCES Rental_details(rental_item_id) ON DELETE CASCADE
    );`
];

createTables.forEach((query, index) => {
    connection.query(query, (err, results) => {
        if (err) {
            console.error(`Error creating table at index ${index}:`, err);
            return;
        }
        console.log(`Table at index ${index} created successfully!`);
    });
});

connection.end();  // Close the connection after executing the queries
