const express = require('express');
const { placeOrder, updateOrderStatus, trackOrder, getOrderById, getOrders } = require('../controllers/orderControllers');
const router = express.Router();
const auth = require('../middleware/auth');


// Place a new order
router.post('/orders', placeOrder);

// Update order status
router.put('/orders/:orderId/status', updateOrderStatus);

// Track order status
router.get('/orders/:orderId/track', trackOrder);

// Get details of a specific order by ID
router.get('/orders/:orderId', getOrderById);

// Get all orders for the logged-in user
router.get('/orders', auth, getOrders);

module.exports = router;
