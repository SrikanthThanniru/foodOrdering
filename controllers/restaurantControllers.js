const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  const { name, location } = req.body;

  try {
    const restaurant = new Restaurant({ name, location });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update restaurant details
exports.updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add menu items to the restaurant's menu
exports.addMenuItem = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, price, available, category } = req.body;

  try {
    const menuItem = new MenuItem({ 
      name, 
      description, 
      price, 
      available, 
      category, 
      restaurant: restaurantId 
    });
    
    await menuItem.save();

    // Add menu item reference to the restaurant
    await Restaurant.findByIdAndUpdate(restaurantId, {
      $push: { menu: menuItem._id }
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a specific menu item
exports.updateMenuItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const menuItem = await MenuItem.findByIdAndUpdate(itemId, req.body, { new: true });
    if (!menuItem) return res.status(404).json({ msg: 'Menu item not found' });
    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
