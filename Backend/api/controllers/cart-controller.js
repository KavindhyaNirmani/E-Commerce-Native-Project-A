const db = require('../../config/db');
const Cart = require('../models/cartModel');      // Import Cart model
const CartItem = require('../models/cartItemModel'); // Import CartItem model




    // Add item to the cart
    exports.addItemToCart= async (req, res) => {
        const { item_id, quantity } = req.body;
        const user_id = req.user.user_id; // Assuming user info is available from auth middleware

         // Log the values for debugging 
         console.log('item_id:', item_id);
         console.log('quantity:', quantity);
         console.log('user_id:', user_id); 
        
        
        // Validate input
        if (!item_id || !quantity) {
            return res.status(400).json({ message: 'Item ID and quantity are required.' });
        }

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        try {
            // First, check if a cart exists for the user. If not, create one
            const [userCart] = await db.execute(
                'SELECT cart_id FROM cart WHERE user_id = ?',
                [user_id]
            );

            let cart_id;
            if (userCart.length === 0) {
                // If the user doesn't have a cart, create one
                const [newCart] = await db.execute(
                    'INSERT INTO cart (user_id, added_at) VALUES (?, NOW())',
                    [user_id]
                );
                cart_id = newCart.insertId; // Get the newly created cart's ID
            } else {
                // If the user already has a cart, use its cart_id
                cart_id = userCart[0].cart_id;
            }

            // Check if the item is already in the cart
            const [existingCartItem] = await db.execute(
                'SELECT * FROM cart_items WHERE cart_id = ? AND item_id = ?',
                [cart_id, item_id]
            );

            if (existingCartItem.length > 0) {
                // If item already exists in the cart, update the quantity
                await db.execute(
                    'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND item_id = ?',
                    [quantity, cart_id, item_id]
                );
                return res.status(200).json({ message: 'Cart updated successfully.' });
            }

            // If item does not exist, add it to the cart
            await db.execute(
                'INSERT INTO cart_items (cart_id, item_id, quantity) VALUES (?, ?, ?)',
                [cart_id||null, item_id||null, quantity||null]
            );

            res.status(201).json({ message: 'Item added to cart successfully.' });

        } catch (error) {
            console.error('Error adding item to cart:', error.message);
            res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
        }
    };

    // Get all items in the user's cart
    exports.getCartItems= async (req, res) => {
        const user_id = req.user.user_id; // Assuming user info is available from auth middleware

        //log user_id for debugging 
        console.log('user_id:', user_id);

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        try {
            // Get cart items for the user
            const [cartItems] = await db.execute(
                `SELECT item.*, cart_items.quantity 
                 FROM cart_items 
                 JOIN item ON cart_items.item_id = item.item_id 
                 JOIN cart ON cart_items.cart_id = cart.cart_id 
                 WHERE cart.user_id = ?`,
                [user_id]
            );

            if (cartItems.length === 0) {
                return res.status(200).json({ message: 'Your cart is empty.' });
            }

            res.status(200).json(cartItems);

        } catch (error) {
            console.error('Error fetching cart items:', error.message);
            res.status(500).json({ message: 'Failed to fetch cart items', error: error.message });
        }
    };



