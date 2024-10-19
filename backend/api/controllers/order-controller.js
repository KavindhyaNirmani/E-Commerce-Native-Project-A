const db=require('../../config/db');


//place an order
exports.placeOrder = async (req, res) => {
    const { selectedItems, first_name, last_name, address, city, postal_code, phone_number, cart_id } = req.body;
    const userId = req.user.user_id;

    
    console.log('Request body:', req.body);
    console.log('User ID:', userId);
    console.log('Selected Items:', selectedItems);

    // Log the cart_id value to see if it's being received
    console.log('Cart ID:', cart_id);

    // Check if cart_id is present in the request
    if (!cart_id) {
        console.error('Cart ID is undefined');
        return res.status(400).json({ error: 'Cart ID is required' });
    }

    try {
        console.log('Placing order for user:', userId);

        // Create a new order
        const [orderResult] = await db.execute(
            `INSERT INTO \`order\` (user_id, total_amount, order_status, cart_id) 
             VALUES (?, 0, 'Pending', ?)`,
            [userId, cart_id] 
        );
        const orderId = orderResult.insertId;

        // Add selected items to order_items
        let totalAmount = 0;
        for (const item of selectedItems) {
            const { item_id, quantity, item_price } = item;

            // Check for undefined values before proceeding
            if (item_id === undefined || quantity === undefined || item_price === undefined) {
                console.error('Undefined values in item:', item);
                return res.status(400).json({ error: 'Invalid item data' });
            }

            const totalPrice = quantity * item_price;
            totalAmount += totalPrice;

            console.log('Adding item to order:', item);
            await db.execute(
                `INSERT INTO order_items (order_id, item_id, quantity, item_price) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item_id, quantity, item_price]
            );
        }

        // Update the total amount of the order
        await db.execute(
            'UPDATE `order` SET total_amount = ? WHERE order_id = ?',
            [totalAmount, orderId]
        );

        // Store delivery details in order_details
        await db.execute(
            `INSERT INTO order_details (order_id, address, city, postal_code, phone_number, first_name, last_name) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [orderId, address, city, postal_code, phone_number, first_name, last_name]
        );

        res.json({
            message: 'Order placed successfully',
            orderId,
            totalAmount
        });
    } catch (err) {
        console.error('Error while placing order:', err);
        res.status(500).json({
            error: 'Failed to place order'
        });
    }
};





//Fetch all orders for an user
exports.getUserOrders=async (req,res)=>{
    const userId=req.user.user_id;

    try{
        const [orders]=await db.execute(
         `SELECT * FROM \`order\` WHERE user_id = ? ORDER BY order_date DESC`,
            [userId]   
        );
        res.json(orders);
    }catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};



//Fetch order details and itemsby order Id
exports.getOrderDetails=async(req,res)=>{
    const{orderId}=req.params;

    try{
        const[orderDetails]=await db.execute(
            'SELECT * FROM order_details WHERE order_id=?',
            [orderId]

        );

        const [orderItems]=await db.execute(
           `SELECT oi.*, i.item_name 
             FROM order_items oi 
             JOIN item i ON oi.item_id = i.item_id 
             WHERE oi.order_id = ?`,
            [orderId] 
        );

        res.json({
            orderDetails:orderDetails[0],orderItems
        });
    }catch(error){
        res.status(500).json({
            error:error.message
        });
    }
};