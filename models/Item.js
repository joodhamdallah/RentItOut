const db = require('../config/database');

// Retrieve all items
const getAllItems = (callback) => {
  db.query('SELECT * FROM Items', callback);
};

// Retrieve a single item by ID
const getItemById = (id, callback) => {
  db.query('SELECT * FROM Items WHERE item_id = ?', [id], callback);
};

// Create a new item
const createItem = (itemData, callback) => {
  const { item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count } = itemData; 
  db.query(
    'INSERT INTO Items (item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count], 
    callback
  );
};

// Update item details
const updateItem = (id, itemData, callback) => {
  const { item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count } = itemData; 
  db.query(
    'UPDATE Items SET item_name = ?, item_description = ?, rent_price = ?, availability = ?, image_url = ?, category_id = ?, deposit = ?, item_count = ? WHERE item_id = ?', 
    [item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count, id], 
    callback
  );
};

const deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM Items WHERE item_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.affectedRows > 0); // Resolves true if an item was deleted, false otherwise
    });
  });
};




module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };
