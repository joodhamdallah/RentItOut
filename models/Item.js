const db = require('../config/database');

class ItemModel {
  // Retrieve all items
  static getAllItems() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Items', (err, results) => {
        if (err) {
          return reject(err); // Handle the error case
        }
        resolve(results); // Return the results
      });
    });
  }

  // Retrieve a single item by ID
  static getItemById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Items WHERE item_id = ?', [id], (err, results) => {
        if (err) {
          return reject(err); 
        }
        if (results.length === 0) {
          return resolve(null); 
        }
        resolve(results[0]); 
      });
    });
  }


// Create a new item
static createItem(itemData) {
  const { item_name, item_description, price_per_day, availability, image_url, category_id, deposit, item_count, user_id } = itemData; 
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Items (item_name, item_description, price_per_day, availability, image_url, category_id, deposit, item_count,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)', 
      [item_name, item_description, price_per_day, availability, image_url, category_id, deposit, item_count,user_id], 
      (err, result) => {
        if (err) {
          return reject(err); 
        }
        resolve(result);
      }
    );
  });
}

// Update item details
static updateItem(id, itemData, callback) {
  // Extract keys and values from itemData for dynamic query generation
  const fields = Object.keys(itemData);
  const values = Object.values(itemData);

  // Construct dynamic query string
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const sql = `UPDATE Items SET ${setClause} WHERE item_id = ?`;

  // Add id as the last parameter for WHERE clause
  values.push(id);

  db.query(sql, values, callback);
}



// Delete an item
static deleteItem(itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      // Get category ID before deleting the item
      const item = await new Promise((res, rej) => {
        db.query('SELECT category_id FROM Items WHERE item_id = ?', [itemId], (err, results) => {
          if (err) return rej(err);
          res(results[0]); 
        });
      });

      if (!item) {
        return resolve(false); //No item found to delete
      }

      const categoryId = item.category_id;

      //Delete the item
      db.query('DELETE FROM Items WHERE item_id = ?', [itemId], (err, results) => {
        if (err) {
          return reject(err); //check for an error
        }

        //Decrement the number of items in the category
        db.query('UPDATE Categories SET number_of_items = number_of_items - 1 WHERE category_id = ?', [categoryId], (err) => {
          if (err) {
            return reject(err); 
          }
          resolve(results.affectedRows > 0); //Resolve true if an item was deleted, false otherwise
        });
      });
    } catch (error) {
      reject(error); 
    }
  });
}
  // Retrieve items by user_id
  static getItemsByUser(userId, callback) {
    db.query('SELECT * FROM Items WHERE user_id = ?', [userId], callback);
  }

  static nullifyUserIdInItems(userId) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE Items SET user_id = NULL WHERE user_id = ?', [userId], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.affectedRows > 0); // Return true if any rows were updated
      });
    });
  }

  // Search for items by name (partial match)
  static searchItemsByName(searchTerm) {
    return new Promise((resolve, reject) => {
      const likeTerm = `%${searchTerm}%`; // SQL LIKE wildcard
      db.query('SELECT * FROM Items WHERE item_name LIKE ?', [likeTerm], (err, results) => {
        if (err) {
          return reject(err); // Handle query error
        }
        resolve(results); // Resolve with results
      });
    });
  }

}
module.exports = ItemModel;
