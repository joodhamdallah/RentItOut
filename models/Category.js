const connection = require('../config/database'); 

class CategoryModel {
    static getAllCategories() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Categories';
            connection.query(query, (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve categories: ' + err.message));
                }
                resolve(results);
            });
        });
    }

    static getCategoryById(categoryId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Categories WHERE category_id = ?';
            connection.query(query, [categoryId], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to retrieve category: ' + err.message));
                }
                resolve(results.length > 0 ? results[0] : null);
            });
        });
    }

    // Search for categories by name 
    static searchCategoryByName(searchTerm) {
        return new Promise((resolve, reject) => {
            const likeTerm = `%${searchTerm}%`; 
            const query = 'SELECT * FROM Categories WHERE category_name LIKE ?';
            connection.query(query, [likeTerm], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to search categories: ' + err.message));
                }
                resolve(results); // Return the array of matching categories
            });
        });
    }    

    static updateCategory(categoryId, data) {
        return new Promise((resolve, reject) => {
            // Create an array to hold query values
            const values = [];
            const fields = [];
    
            // Only add fields that are present in the data object
            if (data.category_name !== undefined) {
                fields.push('category_name = ?');
                values.push(data.category_name);
            }
            
            if (data.category_description !== undefined) {
                fields.push('category_description = ?');
                values.push(data.category_description);
            }
            
            if (data.number_of_items !== undefined) {
                fields.push('number_of_items = ?');
                values.push(data.number_of_items);
            }
    
            // Always include the category_id at the end of the query
            values.push(categoryId);
    
            // Construct the query dynamically based on fields
            const query = `UPDATE Categories SET ${fields.join(', ')} WHERE category_id = ?`;
    
            connection.query(query, values, (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return resolve(null); // Category not found
                }
                // Return the updated data (only include updated fields)
                resolve({
                    ...data, // Return the data that was passed in
                    category_id: categoryId // Include the category ID for reference
                });
            });
        });
    }
    
    
    static createCategory({ category_name, category_description, number_of_items }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO Categories (category_name, category_description, number_of_items) VALUES (?, ?, ?)';
            connection.query(query, [category_name, category_description, number_of_items], (err, results) => {
                if (err) {
                    return reject(new Error('Failed to create category: ' + err.message));
                }
                resolve({ success: true, id: results.insertId, category_name, category_description, number_of_items });
            });
        });
    }
    
    static deleteCategory(categoryId) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Categories WHERE category_id = ?';
            connection.query(query, [categoryId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results.affectedRows > 0); // Returns true if deletion was successful
            });
        });
    }

    static incrementNumberOfItems(categoryId) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE Categories SET number_of_items = number_of_items + 1 WHERE category_id = ?';
      connection.query(query, [categoryId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.affectedRows > 0); // Returns true if the update was successful
      });
    });
  }
  
    
}


module.exports = CategoryModel;
