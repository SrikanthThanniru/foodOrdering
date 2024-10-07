const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/Users');
const MenuItem = require('../models/MenuItem'); 
const { getIo } = require('../utilis/Socket');


// Place a new order
const placeOrder = async (req, res) => {
  try {
    const { userId, restaurantId, items, deliveryAddress } = req.body;

    // Fetch user and restaurant details
    const user = await User.findById(userId);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!user || !restaurant) {
      return res.status(400).json({ message: 'Invalid user or restaurant' });
    }

    // console.log('Restaurant:', restaurant); // Log the entire restaurant object

    // Calculate total cost from menu items
    let totalCost = 0;
    const orderItems = [];

    for (const item of items) {
      // Fetch the menu item details from MenuItem collection
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: 'Invalid menu item' });
      }

      // console.log('Menu item found:', menuItem); // Log the menu item found

      // Ensure item.quantity is a number and greater than 0
      const quantity = Number(item.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity for menu item' });
      }

      if (menuItem.price === undefined || isNaN(menuItem.price)) {
        return res.status(400).json({ message: 'Invalid price for menu item' });
      }

      totalCost += menuItem.price * quantity;
      orderItems.push({ menuItemId: item.menuItemId, quantity, price: menuItem.price });
    }

    // console.log('Total cost calculated:', totalCost); 

    // Validate that totalCost is a valid number
    if (isNaN(totalCost) || totalCost < 0) {
      return res.status(400).json({ message: 'Total cost calculation failed' });
    }

    const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    const newOrder = new Order({
      userId,
      restaurantId,
      items: orderItems,
      deliveryAddress,
      totalCost,
      status: 'Pending',
      estimatedDeliveryTime,
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder._id,
      totalCost,
      estimatedDeliveryTime,
      status: 'Pending',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Confirmed', 'In Progress', 'Out for Delivery', 'Delivered'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Retrieve the io instance only after initialization
    const io = getIo();
    io.emit('orderStatusUpdate', { orderId, status }); // Emit event using socket.io

    res.status(200).json({ message: 'Order status updated', status });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  updateOrderStatus
};

// Track order status
const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      orderId: order._id,
      status: order.status,
      estimatedDeliveryTime: order.estimatedDeliveryTime
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get details of a specific order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have access to this order' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for the logged-in user
const getOrders = async (req, res) => {
  try {
    console.log('req.user:', req.user)
    const userId = req.user.userId; //  user authentication middleware adds the user object to the request

    const orders = await Order.find({ userId });
    console.log('User ID:', userId);


    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    console.log("orders", orders)
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  placeOrder,
  updateOrderStatus,
  trackOrder, getOrderById, getOrders
};
