const ItemService = require('../services/Items/ItemService');


exports.listItems = async (req, res) => {
  try {
    const items = await ItemService.getAllItems();
    res.status(200).json(items);
  } catch (err) {
    console.error('Error retrieving items:', err);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await ItemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ item });
  } catch (err) {
    console.error('Error retrieving item:', err);
    res.status(500).json({ error: 'Failed to retrieve item' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const itemData = { ...req.body, user_id: req.userId };
    const result = await ItemService.createItem(itemData);
    res.status(201).json({ message: 'Item created successfully', item_id: result.insertId });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    await ItemService.updateItem(req.params.id, req.body);
    res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const success = await ItemService.deleteItem(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
};

exports.getItemsByUser = async (req, res) => {
  try {
    const items = await ItemService.getItemsByUser(req.userId);
    res.status(200).json(items);
  } catch (err) {
    console.error('Error retrieving items for user:', err);
    res.status(500).json({ error: 'Failed to retrieve items for the user' });
  }
};

exports.searchItemsByName = async (req, res) => {
  try {
    const items = await ItemService.searchItemsByName(req.params.name);
    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found' });
    }
    res.status(200).json(items);
  } catch (err) {
    console.error('Error searching items:', err);
    res.status(500).json({ error: 'Failed to search for items' });
  }
};
