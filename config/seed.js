const connection = require('./database');  // Import the db connection
const { faker } = require('@faker-js/faker');

// Function to insert data into Roles table
const insertRoles = () => {
  const roles = [
    ['Admin', 'Administrator role'],
    ['Dealer', 'Owner who offers items for renting'],
    ['Customer', 'Regular user role who can rent items from the website']
  ];

  roles.forEach(role => {
    connection.query(
      'INSERT INTO Roles (role_name, role_description) VALUES (?, ?)',
      role,
      (err) => {
        if (err) throw err;
        console.log(`Role ${role[0]} inserted`);
      }
    );
  });
};

// Function to insert fake data into Users table with dynamic role_id
const insertUsers = () => {
  connection.query('SELECT role_id FROM Roles', (err, results) => {
    if (err) throw err;
    const roleIds = results.map(role => role.role_id);

    for (let i = 0; i < 5; i++) {
      const randomRoleId = roleIds[Math.floor(Math.random() * roleIds.length)];
      const fakeUser = [
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
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
          console.log(`User ${fakeUser[0]} inserted`);
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
        faker.commerce.price(50, 200, 2), // deposit
        faker.number.int({ min: 1, max: 20 }) // item_count 
      ];

      connection.query(
        'INSERT INTO Items (item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
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
