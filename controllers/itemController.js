const Item = require('../models/Item');
const CategoryModel = require('../models/Category'); 

// List all items
exports.listItems = (req, res) => {
  Item.getAllItems((err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve items' });
    }
    res.status(200).json(results);
  });
};

// Get item by ID
exports.getItem = (req, res) => {
  const id = req.params.id;
  Item.getItemById(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve item' });
    }
    res.status(200).json(result);
  });
};


// Create a new item
exports.createItem = async (req, res) => {
  const itemData = req.body;
  const { category_id } = itemData; // take cat_id from the request body

  try {
    //Create the new item
    const result = await Item.createItem(itemData);

    //Increment the number of items for the given cat_id
    const success = await CategoryModel.incrementNumberOfItems(category_id); 

    if (!success) {
      return res.status(404).json({ error: 'Category not found or number of items could not be updated' });
    }
    res.status(201).json({ message: 'Item created successfully', item_id: result.insertId });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// Update item details
exports.updateItem = (req, res) => {
  const id = req.params.id;
  const itemData = req.body;
  Item.updateItem(id, itemData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update item' });
    }
    res.status(200).json({ message: 'Item updated successfully' });
  });
};

// Delete an item
exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;

  try {
    const success = await Item.deleteItem(itemId);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: 'Failed to delete item', error });
  }
};



