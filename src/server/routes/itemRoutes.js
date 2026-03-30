const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  getItems, 
  createItem, 
  updateItem, 
  deleteItem, 
  getExpiringSoon 
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Validation chains for Creating and Updating Items
const itemValidation = [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('category').optional({ checkFalsy: true }).trim().escape(),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('location_id').isInt().withMessage('Location ID must be an integer'),
  body('unit_id').isInt().withMessage('Unit ID must be an integer'),
  body('expiration_date').optional({ checkFalsy: true }).isISO8601().withMessage('Provide a valid date'),
];

// Protect all routes below this line
router.use(protect);

router.get('/expiring-soon', getExpiringSoon);

router.route('/')
  .get(getItems)
  .post(itemValidation, createItem);

router.route('/:id')
  .put(itemValidation, updateItem)
  .delete(deleteItem);

module.exports = router;
