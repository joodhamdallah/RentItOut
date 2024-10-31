const connection = require('./database');  // Import the db connection
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
// Function to insert data into Roles table
const insertRoles = () => {
  const roles = [
    [1, 'Admin', 'Platform administrator'],         // Admin with role_id = 1
    [2, 'Vendor', 'Offers items for rent'],         // Vendor with role_id = 2
    [3, 'Customer', 'Can rent items from vendors']  // Customer with role_id = 3
  ];

  roles.forEach(role => {
    connection.query(
      'INSERT INTO Roles (role_id, role_name, role_description) VALUES (?, ?, ?)',
      role,
      (err) => {
        if (err) throw err;
        console.log(`Role ${role[1]} inserted`);
      }
    );
  });
};

// Function to insert fake data into Users table with dynamic role_id
const insertUsers = async () => {
  // Retrieve role IDs for admin, customer, and vendor roles
  connection.query('SELECT role_id, role_name FROM Roles', async (err, results) => {
    if (err) throw err;

    // Map roles by role name to find correct IDs
    const roleMap = {};
    results.forEach(role => {
      roleMap[role.role_name.toLowerCase()] = role.role_id;
    });

    // Predefined users with respective roles
    const users = [
      // Admins
      { username: 'admin1', email: 'admin1@example.com', password: await bcrypt.hash('AdminPass123', 10), role: 'admin', phone: '123-456-7890', firstName: 'Admin', lastName: 'One', address: '123 Admin St' },
      { username: 'admin2', email: 'admin2@example.com', password: await bcrypt.hash('AdminPass456', 10), role: 'admin', phone: '234-567-8901', firstName: 'Admin', lastName: 'Two', address: '456 Admin Ave' },
      
      // Customers
      { username: 'customer1', email: 'customer1@example.com', password: await bcrypt.hash('CustPass123', 10), role: 'customer', phone: '345-678-9012', firstName: 'Customer', lastName: 'One', address: '123 Customer St' },
      { username: 'customer2', email: 'customer2@example.com', password: await bcrypt.hash('CustPass456', 10), role: 'customer', phone: '456-789-0123', firstName: 'Customer', lastName: 'Two', address: '456 Customer Ave' },
      
      // Vendors
      { username: 'vendor1', email: 'vendor1@example.com', password: await bcrypt.hash('VendorPass123', 10), role: 'vendor', phone: '567-890-1234', firstName: 'Vendor', lastName: 'One', address: '123 Vendor St' },
      { username: 'vendor2', email: 'vendor2@example.com', password: await bcrypt.hash('VendorPass456', 10), role: 'vendor', phone: '678-901-2345', firstName: 'Vendor', lastName: 'Two', address: '456 Vendor Ave' }
    ];

    // Insert each predefined user
    users.forEach(user => {
      const userData = [
        user.username,
        user.email,
        user.password,
        roleMap[user.role],  // Map role to its ID
        user.phone,
        user.firstName,
        user.lastName,
        user.address
      ];

      connection.query(
        'INSERT INTO Users (user_name, email, password, role_id, phone_number, first_name, last_name, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        userData,
        (err) => {
          if (err) throw err;
          console.log(`User ${user.username} inserted successfully`);
        }
      );
    });

    // Generate 4 random users with random roles
    for (let i = 0; i < 4; i++) {
      const randomRoleId = roleMap[Object.keys(roleMap)[Math.floor(Math.random() * Object.keys(roleMap).length)]];

      const fakeUser = [
        faker.internet.userName(),
        faker.internet.email(),
        await bcrypt.hash(faker.internet.password(), 10),  // Hash the fake password
        randomRoleId,
        faker.phone.number(),
        faker.person.firstName(),
        faker.person.lastName(),
        faker.location.streetAddress()
      ];

      connection.query(
        'INSERT INTO Users (user_name, email, password, role_id, phone_number, first_name, last_name, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        fakeUser,
        (err) => {
          if (err) throw err;
          console.log(`Random user ${fakeUser[0]} inserted successfully`);
        }
      );
    }
  });
};
// Function to insert fake data into Categories table
const insertCategories = () => {
  const categories = [
    ['Electronics', 'Electronic gadgets and devices', 10],
    ['Furniture', 'Household furniture', 5],
    ['Appliances', 'Home appliances like refrigerators and washing machines', 8],
    ['Books', 'Books of all genres and categories', 15],
    ['Sports', 'Sports equipment and gear', 12],
    ['Automotive', 'Vehicle parts and accessories', 7]
  ];

  categories.forEach(category => {
    connection.query(
      'INSERT INTO Categories (category_name, category_description, number_of_items) VALUES (?, ?, ?)',
      category,
      (err) => {
        if (err) throw err;
        console.log(`Category ${category[0]} inserted`);
      }
    );
  });
};

// Function to insert fake data into Items table with dynamic category_id
const insertItems = () => {
  connection.query('SELECT category_id FROM Categories', (err, results) => {
    if (err) throw err;
    const categoryIds = results.map(category => category.category_id);

    for (let i = 0; i < 10; i++) {
      const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
      const fakeItem = [
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        faker.commerce.price(),
        faker.datatype.boolean(),
        faker.image.url(),
        randomCategoryId,
        faker.commerce.price(50, 200, 2)
      ];

      connection.query(
        'INSERT INTO Items (item_name, item_description, rent_price, availability, image_url, category_id, deposit) VALUES (?, ?, ?, ?, ?, ?, ?)',
        fakeItem,
        (err) => {
          if (err) throw err;
          console.log(`Item ${fakeItem[0]} inserted`);
        }
      );
    }
  });
};

// Function to insert fake data into Rentals table with dynamic user_id
const insertRentals = () => {
  connection.query('SELECT user_id FROM Users', (err, results) => {
    if (err) throw err;
    const userIds = results.map(user => user.user_id);

    for (let i = 0; i < 6; i++) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      const fakeRental = [
        faker.date.past(),
        faker.date.future(),
        randomUserId,
        faker.helpers.arrayElement(['Delivery', 'Pickup'])
      ];

      connection.query(
        'INSERT INTO Rentals (rental_date, return_date, user_id, logistic_type) VALUES (?, ?, ?, ?)',
        fakeRental,
        (err) => {
          if (err) throw err;
          console.log(`Rental for user_id ${randomUserId} inserted`);
        }
      );
    }
  });
};

// Function to insert fake data into Rental_details table with dynamic rental_id and item_id
const insertRentalDetails = () => {
  connection.query('SELECT rental_id FROM Rentals', (err, rentalResults) => {
    if (err) throw err;
    const rentalIds = rentalResults.map(rental => rental.rental_id);

    connection.query('SELECT item_id FROM Items', (err, itemResults) => {
      if (err) throw err;
      const itemIds = itemResults.map(item => item.item_id);

      for (let i = 0; i < 6; i++) {
        const randomRentalId = rentalIds[Math.floor(Math.random() * rentalIds.length)];
        const randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
        const fakeRentalDetail = [
          randomRentalId,
          randomItemId,
          faker.number.int({ min: 1, max: 5 }),
          faker.commerce.price()
        ];

        connection.query(
          'INSERT INTO Rental_details (rental_id, item_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
          fakeRentalDetail,
          (err) => {
            if (err) throw err;
            console.log(`Rental detail for rental_id ${randomRentalId} and item_id ${randomItemId} inserted`);
          }
        );
      }
    });
  });
};

// Function to insert fake data into Feedbacks table with dynamic rental_id and user_id
const insertFeedbacks = () => {
  connection.query('SELECT rental_id FROM Rentals', (err, rentalResults) => {
    if (err) throw err;
    const rentalIds = rentalResults.map(rental => rental.rental_id);

    connection.query('SELECT user_id FROM Users', (err, userResults) => {
      if (err) throw err;
      const userIds = userResults.map(user => user.user_id);

      for (let i = 0; i < 5; i++) {
        const randomRentalId = rentalIds[Math.floor(Math.random() * rentalIds.length)];
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        const fakeFeedback = [
          randomRentalId,
          randomUserId,
          faker.lorem.sentence(),
          faker.number.int({ min: 1, max: 5 })
        ];

        connection.query(
          'INSERT INTO Feedbacks (rental_id, user_id, comment, rating) VALUES (?, ?, ?, ?)',
          fakeFeedback,
          (err) => {
            if (err) throw err;
            console.log(`Feedback for rental_id ${randomRentalId} by user_id ${randomUserId} inserted`);
          }
        );
      }
    });
  });
};

// Function to insert fake data into Payments table
const insertPayments = () => {
  const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'];

  for (let i = 0; i < 4; i++) {
    const fakePayment = [
      faker.helpers.arrayElement(paymentMethods)
    ];

    connection.query(
      'INSERT INTO Payments (payment_method) VALUES (?)',
      fakePayment,
      (err) => {
        if (err) throw err;
        console.log(`Payment method ${fakePayment[0]} inserted`);
      }
    );
  }
};

// Function to insert fake data into Bills table with dynamic rental_id and pay_id
const insertBills = () => {
    connection.query('SELECT rental_id FROM Rentals', (err, rentalResults) => {
      if (err) throw err;
      const rentalIds = rentalResults.map(rental => rental.rental_id);
  
      connection.query('SELECT Pay_id FROM Payments', (err, paymentResults) => {
        if (err) throw err;
        const payIds = paymentResults.map(payment => payment.Pay_id);
  
        for (let i = 0; i < 5; i++) {
          const randomRentalId = rentalIds[Math.floor(Math.random() * rentalIds.length)];
          const randomPayId = payIds[Math.floor(Math.random() * payIds.length)];
          const fakeBill = [
            faker.commerce.price(),
            randomPayId,      // Assign a random pay_id
            randomRentalId    // Assign a random rental_id
          ];
  
          connection.query(
            'INSERT INTO Bills (total_price, Pay_id, rental_id) VALUES (?, ?, ?)',
            fakeBill,
            (err) => {
              if (err) throw err;
              console.log(`Bill for rental_id ${randomRentalId} with pay_id ${randomPayId} inserted`);
            }
          );
        }
      });
    });
  };
  

// Function to insert fake data into Returning_Items table with dynamic category_id
const insertReturningItems = () => {
  connection.query('SELECT category_id FROM Categories', (err, results) => {
    if (err) throw err;
    const categoryIds = results.map(category => category.category_id);

    for (let i = 0; i < 5; i++) {
      const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
      const fakeReturningItem = [
        faker.commerce.productName(),
        faker.helpers.arrayElement(['Good', 'Damaged', 'Needs Replacement']),
        faker.commerce.price(20, 150, 2),
        randomCategoryId
      ];

      connection.query(
        'INSERT INTO Returning_Items (item_name, status_for_item, replacement_price, category_id) VALUES (?, ?, ?, ?)',
        fakeReturningItem,
        (err) => {
          if (err) throw err;
          console.log(`Returning item ${fakeReturningItem[0]} inserted`);
        }
      );
    }
  });
};

// Call the insert functions sequentially
insertRoles();
setTimeout(insertUsers, 2000);      // Ensure Roles are inserted before Users
setTimeout(insertCategories, 4000);  // Categories
setTimeout(insertItems, 6000);       // Items depends on Categories
setTimeout(insertRentals, 8000);     // Rentals depends on Users
setTimeout(insertRentalDetails, 10000); // Rental_details depends on Rentals and Items
setTimeout(insertFeedbacks, 12000);  // Feedbacks depends on Rentals and Users
setTimeout(insertPayments, 14000);   // Payments must be inserted before Bills
setTimeout(insertBills, 16000);      // Bills depend on Rentals and Payments
setTimeout(insertReturningItems, 18000); // Returning_Items depends on Categories

// Close the connection when done
setTimeout(() => connection.end(), 20000);
