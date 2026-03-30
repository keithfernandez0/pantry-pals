const pool = require('../config/db');
const { validationResult } = require('express-validator');

// @desc    Get all pantry items for logged-in user
// @route   GET /items
// @access  Private
const getItems = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM pantry_items WHERE user_id = ?', 
      [req.user.id]
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error in getItems:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new pantry item
// @route   POST /items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { location_id, name, category, quantity, unit_id, expiration_date } = req.body;

    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Based on earlier DB schema, location_id, name, unit_id are required
    if (!location_id || !name || !unit_id) {
      return res.status(400).json({ message: 'Missing required fields (location_id, name, unit_id)' });
    }

    const [result] = await pool.execute(
      `INSERT INTO pantry_items 
       (user_id, location_id, name, category, quantity, unit_id, expiration_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, 
        location_id, 
        name, 
        category || null, 
        quantity || 0, 
        unit_id, 
        expiration_date || null
      ]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Item created successfully' 
    });
  } catch (error) {
    console.error('Error in createItem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an existing pantry item
// @route   PUT /items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { location_id, name, category, quantity, unit_id, expiration_date } = req.body;

    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Using user_id here ensures a user can't update another user's items
    const [result] = await pool.execute(
      `UPDATE pantry_items 
       SET location_id=?, name=?, category=?, quantity=?, unit_id=?, expiration_date=? 
       WHERE id=? AND user_id=?`,
      [location_id, name, category, quantity, unit_id, expiration_date, itemId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or you do not have permission' });
    }

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error in updateItem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a pantry item
// @route   DELETE /items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    // Checks user_id to prevent deleting another user's item
    const [result] = await pool.execute(
      'DELETE FROM pantry_items WHERE id=? AND user_id=?', 
      [itemId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or you do not have permission' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error in deleteItem:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get items expiring within the next 14 days
// @route   GET /items/expiring-soon
// @access  Private
const getExpiringSoon = async (req, res) => {
  try {
    // Queries items where expiration is between TODAY and 14 days from now
    const [rows] = await pool.execute(
      `SELECT * FROM pantry_items 
       WHERE user_id = ? 
       AND expiration_date IS NOT NULL 
       AND expiration_date <= DATE_ADD(CURDATE(), INTERVAL 14 DAY) 
       AND quantity > 0
       ORDER BY expiration_date ASC`,
      [req.user.id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error in getExpiringSoon:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getExpiringSoon
};
