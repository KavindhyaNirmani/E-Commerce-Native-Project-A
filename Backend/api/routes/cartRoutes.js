const express = require('express');
const cartController = require('../controllers/cartController');  
const { protect } = require('../middleware/authMiddleware');     
const router = express.Router(); 



// Add an item to the cart (Protected)
router.post('/add', protect, cartController.addItemToCart);  

// Get all items in the user's cart (Protected)
router.get('/cart', protect, cartController.getCartItems);  

module.exports = router;
