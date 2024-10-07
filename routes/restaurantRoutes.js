const express = require('express');
const { 
  createRestaurant, 
  updateRestaurant, 
  addMenuItem, 
  updateMenuItem 
} = require('../controllers/restaurantControllers');

const router = express.Router();

// Create a new restaurant
router.post('/', createRestaurant);

// Update restaurant details
router.put('/:restaurantId', updateRestaurant);

// Add menu items to the restaurant's menu
router.post('/:restaurantId/menu', addMenuItem);

// Update a specific menu item
router.put('/:restaurantId/menu/:itemId', updateMenuItem);

module.exports = router;
