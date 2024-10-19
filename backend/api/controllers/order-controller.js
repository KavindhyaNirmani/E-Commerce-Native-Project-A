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

        // Check for an active promotion
        const [promotion] = await db.execute(
            `SELECT discount_percentage FROM promotion 
             WHERE CURDATE() BETWEEN start_date AND end_date 
             LIMIT 1`
        );
        const discountPercentage = promotion.length ? promotion[0].discount_percentage : 0;


        // Create a new order
        const [orderResult] = await db.execute(
            `INSERT INTO \`order\` (user_id, total_amount, order_status, cart_id,discount,final_amount) 
             VALUES (?, 0, 'Pending', ?,0,0)`,
            [userId, cart_id] 
        );
        const orderId = orderResult.insertId;

        // Calculate total amount and add items to the order
        let totalAmount = 0;
        for (const item of selectedItems) {
            const { item_id, quantity, item_price } = item;
            const itemTotal = quantity * item_price;
            totalAmount += itemTotal;

            await db.execute(
                `INSERT INTO order_items (order_id, item_id, quantity, item_price) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, item_id, quantity, item_price]
            );
        }

        // Calculate discount and final amount
        const discountAmount = (totalAmount * discountPercentage) / 100;
        const finalAmount = totalAmount - discountAmount;

        // Update the order with the discount and final amount
        await db.execute(
            `UPDATE \`order\` SET total_amount = ?, discount = ?, final_amount = ? WHERE order_id = ?`,
            [totalAmount, discountAmount, finalAmount, orderId]
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
            totalAmount,
            discountAmount,
            finalAmount
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