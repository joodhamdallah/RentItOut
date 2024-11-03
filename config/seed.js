const connection = require('./database');  // Import the db connection
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
// Function to insert data into Roles table
const insertRoles = () => {
  const roles = [
    [1, 'Admin', 'Platform administrator'],         // Admin with role_id = 1
    [2, 'Vendor', 'Offers items for rent'],         // Vendor with role_id = 2
    [3, 'Customer', 'Can rent items from vendors'],  // Customer with role_id = 3
    [4, 'Insurance Team', 'Manages insurance policies for rented items'] //Insurance team with role_id = 4
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


//insert fake data into Items table with dynamic category_id and user_id
const insertItems = () => {
  connection.query('SELECT category_id FROM Categories', (err, categoryResults) => {
    if (err) throw err;
    const categoryIds = categoryResults.map(category => category.category_id);

    connection.query('SELECT user_id FROM Users', (err, userResults) => {
      if (err) throw err;
      const userIds = userResults.map(user => user.user_id);

      for (let i = 0; i < 10; i++) {
        const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
        const fakeItem = [
          faker.commerce.productName(),
          faker.commerce.productDescription(),
          faker.commerce.price(10, 100, 2),  //realistic price per day
          faker.datatype.boolean(),
          faker.image.url(),
          randomCategoryId,
          faker.commerce.price(50, 200, 2), // Deposit
          faker.number.int({ min: 1, max: 20 }), // item_count
          randomUserId
        ];

        connection.query(
          'INSERT INTO Items (item_name, item_description, price_per_day, availability, image_url, category_id, deposit, item_count, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          fakeItem,
          (err) => {
            if (err) throw err;
            console.log(`Item ${fakeItem[0]} inserted`);
          }
        );
      }
    });
  });
};


const insertDiscounts = () => {
  const discounts = [
    [1, 'Percentage Amount Discount', 10.00, 'Get 10% off any rental above $100.'], 
    [2, 'Long-Term Rental Discount', 12.00, 'Get 12% off for rentals longer than 7 days.'], 
    [3, 'Loyalty Discount', 5.00, 'Enjoy 5% off after 5 rentals.'], 
    [4, 'First Purchase Discount', 15.00, 'Get 15% off your first rental.'] 
  ];

  discounts.forEach(discount => {
    connection.query(
      'INSERT INTO Discounts (discount_id, discount_name, discount_percentage, description) VALUES (?, ?, ?, ?)',
      discount,
      (err) => {
        if (err) throw err;
        console.log(`Discount ${discount[1]} inserted`);
      }
    );
  });
};

// Function to insert fake data into Rentals table with dynamic user_id and discount_id
const insertRentals = () => {
  connection.query('SELECT user_id FROM Users', (err, results) => {
    if (err) throw err;
    const userIds = results.map(user => user.user_id);

    for (let i = 0; i < 6; i++) {
      const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
      const randomDiscountId = Math.floor(Math.random() * 4) + 1; // Random number between 1 and 4

      const fakeRental = [
        randomUserId,
        faker.helpers.arrayElement(['Delivery', 'Pickup']),
        randomDiscountId 
      ];

      connection.query(
        'INSERT INTO Rentals (user_id, logistic_type, discount_id) VALUES (?, ?, ?)',
        fakeRental,
        (err) => {
          if (err) throw err;
          console.log(`Rental for user_id ${randomUserId} with discount_id ${randomDiscountId} inserted`);
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
          faker.date.past(),
          faker.date.future(),
          faker.commerce.price()
        ];

        connection.query(
          'INSERT INTO Rental_details (rental_id, item_id, quantity, rental_date, return_date, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
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

// Function to insert unique payment methods into Payments table
const insertPayments = () => {
  const paymentMethods = ['Credit Card', 'PayPal', 'Cash'];

  paymentMethods.forEach(paymentMethod => {
    connection.query(
      'INSERT INTO Payments (payment_method) VALUES (?)',
      [paymentMethod],
      (err) => {
        if (err) throw err;
        console.log(`Payment method ${paymentMethod} inserted`);
      }
    );
  });
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
  
  const insertReturningItems = () => {
    // Fetch rental_item_id and item_id
    connection.query('SELECT rental_item_id FROM Rental_details', (err, rentalResults) => {
      if (err) throw err;
  
      // Fetch item_ids from Items table
      connection.query('SELECT item_id FROM Items', (err, itemResults) => {
        if (err) throw err;
  
        const rentalItemIds = rentalResults.map(item => item.rental_item_id);
        const itemIds = itemResults.map(item => item.item_id);
  
        for (let i = 0; i < 5; i++) {
          const randomRentalItemId = rentalItemIds[Math.floor(Math.random() * rentalItemIds.length)];
          const randomItemId = itemIds[Math.floor(Math.random() * itemIds.length)]; // Get random item_id
  
          const fakeReturningItem = [
            faker.commerce.productName(),
            faker.helpers.arrayElement(['Excellent','Good', 'Damaged', 'Needs Replacement']),
            faker.commerce.price(20, 150, 2),
            faker.date.future(),
            randomRentalItemId,
            randomItemId, // Add the random item_id here
            faker.commerce.price(5, 50, 2)  // Random overtime charge between 5 and 50 with 2 decimal places
          ];
  
          connection.query(
            'INSERT INTO Returning_Items (item_name, status_for_item, returned_amount, actual_return_date, rental_item_id, item_id, overtime_charge) VALUES (?, ?, ?, ?, ?, ?, ?)',
            fakeReturningItem,
            (err) => {
              if (err) throw err;
              console.log(`Returning item ${fakeReturningItem[0]} inserted`);
            }
          );
        }
      });
    });
  };
  
  

// Call the insert functions sequentially
insertRoles();
setTimeout(insertUsers, 2000);      // Ensure Roles are inserted before Users
setTimeout(insertCategories, 4000);  // Categories
setTimeout(insertItems, 6000);       // Items depends on Categories
setTimeout(insertDiscounts, 6000); 
setTimeout(insertRentals, 8000);     // Rentals depends on Users
setTimeout(insertRentalDetails, 10000); // Rental_details depends on Rentals and Items
setTimeout(insertFeedbacks, 12000);  // Feedbacks depends on Rentals and Users
setTimeout(insertPayments, 14000);   // Payments must be inserted before Bills
setTimeout(insertBills, 16000);      // Bills depend on Rentals and Payments
setTimeout(insertReturningItems, 18000); // Returning_Items depends on Categories

// Close the connection when done
setTimeout(() => connection.end(), 20000);
