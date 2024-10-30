const db = require("../../config/db");

//place an order
exports.placeOrder = async (req, res) => {
  const {
    selectedItems,
    first_name,
    last_name,
    address,
    city,
    postal_code,
    phone_number,
    cart_id,
  } = req.body;
  const userId = req.user.user_id;

  console.log("Request body:", req.body);
  console.log("User ID:", userId);
  console.log("Selected Items:", selectedItems);

  // Log the cart_id value to see if it's being received
  console.log("Cart ID:", cart_id);

  // Check if cart_id is present in the request
  if (!cart_id) {
    console.error("Cart ID is undefined");
    return res.status(400).json({ error: "Cart ID is required" });
  }

  try {
    console.log("Placing order for user:", userId);

    // Check for an active promotion
    const [promotion] = await db.execute(
      `SELECT pr.discount_percentage 
       FROM promotion p
       JOIN promotion_rule pr ON p.promotion_id = pr.promotion_id
       WHERE CURDATE() BETWEEN p.start_date AND p.end_date 
       LIMIT 1`
    );
    const discountPercentage = promotion.length
      ? promotion[0].discount_percentage
      : 0;

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
      message: "Order placed successfully",
      orderId,
      totalAmount,
      discountAmount,
      finalAmount,
    });
  } catch (err) {
    console.error("Error while placing order:", err);
    res.status(500).json({
      error: "Failed to place order",
    });
  }
};

//Fetch all orders for an user
exports.getUserOrders = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [orders] = await db.execute(
      `SELECT * FROM \`order\` WHERE user_id = ? ORDER BY order_date DESC`,
      [userId]
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//Fetch order details and itemsby order Id
exports.getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const [orderDetails] = await db.execute(
      "SELECT * FROM order_details WHERE order_id=?",
      [orderId]
    );

    const [orderItems] = await db.execute(
      `SELECT orderItem.*, itm.item_name 
             FROM order_items orderItem 
             JOIN item itm ON orderItem.item_id = itm.item_id 
             WHERE orderItem.order_id = ?`,
      [orderId]
    );

    res.json({
      orderDetails: orderDetails[0],
      orderItems,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//Get all orders for admin Management
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      "SELECT ord.order_id, GROUP_CONCAT(itm.item_name SEPARATOR ', ') AS item_names, SUM(orderItem.item_price) AS total_final_price, ord.order_status FROM `order` ord JOIN order_items orderItem ON ord.order_id = orderItem.order_id JOIN item itm ON orderItem.item_id = itm.item_id GROUP BY ord.order_id"
    );

    // Formatting the results to a more structured response
    const formattedOrders = orders.map(order => ({
      order_id: order.order_id,
      item_names: order.item_names,
      total_final_price: order.total_final_price,
      order_status: order.order_status,
    }));

    res.json(formattedOrders);
    
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get order statistics
exports.getOrderStatistics = async (req, res) => {
  try {
    const totalCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\``
    );
    const pendingCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\` WHERE order_status = 'Pending'`
    );
    const successfulCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\` WHERE order_status = 'Successful'`
    );
    const failedCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\` WHERE order_status = 'Failed'`
    );

    res.json({
      totalOrders: totalCount[0][0].count,
      pendingOrders: pendingCount[0][0].count,
      successfulOrders: successfulCount[0][0].count,
      failedOrders: failedCount[0][0].count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId, newStatus } = req.body;

  try {
    await db.execute(
      `UPDATE \`order\` SET order_status = ? WHERE order_id = ?`,
      [newStatus, orderId]
    );
    res.json({ message: "Order status updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    await db.execute(`UPDATE \`order\` SET is_deleted = 1 WHERE order_id = ?`, [
      orderId,
    ]);
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
