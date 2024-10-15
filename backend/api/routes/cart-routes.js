const express = require('express');
const cartController = require('../controllers/cart-controller');  
const { protect } = require('../middleware/auth-middleware');     
const router = express.Router(); 



// Add an item to the cart (Protected)
router.post('/add', protect, cartController.addItemToCart);  

// Get all items in the user's cart (Protected)
router.get('/', protect, cartController.getCartItems);  


module.exports = router;
