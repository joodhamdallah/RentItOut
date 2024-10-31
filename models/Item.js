const db = require('../config/database');

class ItemModel {
  // Retrieve all items
  static getAllItems(callback) {
    db.query('SELECT * FROM Items', callback);
  }

  // Retrieve a single item by ID
  static getItemById(id, callback) {
    db.query('SELECT * FROM Items WHERE item_id = ?', [id], callback);
  }

// Create a new item
static createItem(itemData) {
  const { item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count } = itemData; 
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Items (item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count], 
      (err, result) => {
        if (err) {
          return reject(err); // Reject the promise with the error
        }
        resolve(result); // Resolve the promise with the result
      }
    );
  });
}

  // Update item details
  static updateItem(id, itemData, callback) {
    const { item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count } = itemData; 
    db.query(
      'UPDATE Items SET item_name = ?, item_description = ?, rent_price = ?, availability = ?, image_url = ?, category_id = ?, deposit = ?, item_count = ? WHERE item_id = ?', 
      [item_name, item_description, rent_price, availability, image_url, category_id, deposit, item_count, id], 
      callback
    );
  }


// Delete an item
static deleteItem(itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Get the category ID before deleting the item
      const item = await new Promise((res, rej) => {
        db.query('SELECT category_id FROM Items WHERE item_id = ?', [itemId], (err, results) => {
          if (err) return rej(err);
          res(results[0]); // Resolve with the first result
        });
      });

      if (!item) {
        return resolve(false); // No item found to delete
      }

      const categoryId = item.category_id;

      // Step 2: Delete the item
      db.query('DELETE FROM Items WHERE item_id = ?', [itemId], (err, results) => {
        if (err) {
          return reject(err); // Reject if there's an error
        }

        // Step 3: Decrement the number of items in the category
        db.query('UPDATE Categories SET number_of_items = number_of_items - 1 WHERE category_id = ?', [categoryId], (err) => {
          if (err) {
            return reject(err); // Reject if there's an error
          }
          resolve(results.affectedRows > 0); // Resolve true if an item was deleted, false otherwise
        });
      });
    } catch (error) {
      reject(error); // Handle any errors
    }
  });
}
}
module.exports = ItemModel;
