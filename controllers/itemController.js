const Item = require('../models/Item');

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
exports.createItem = (req, res) => {
  const itemData = req.body;
  Item.createItem(itemData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create item' });
    }
    res.status(201).json({ message: 'Item created successfully', itemId: result.insertId });
  });
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
  const id = req.params.id;

  try {
      const success = await Item.deleteItem(id);
      if (!success) {
          return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
      console.error("Error deleting item:", err);
      res.status(500).json({ success: false, message: 'Failed to delete item', error: err });
  }
};

