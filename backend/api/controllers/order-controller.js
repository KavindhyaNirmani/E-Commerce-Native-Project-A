const db = require("../../config/db");

exports.transferSelectedItemsToCheckout = async (req, res) => {
  const { selectedCartItemIds } = req.body;
  const userId = req.user.user_id;

  console.log("Incoming request body:", req.body);
  console.log("User ID:", userId);

  if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
    return res.status(400).json({ error: "No items selected for checkout" });
  }

  console.log("Selected Cart Item IDs:", selectedCartItemIds);

  try {
    const placeholders = selectedCartItemIds.map(() => "?").join(",");
    const query = `
  UPDATE cart_items
  SET selected = 1
  WHERE cart_item_id IN (${placeholders})
    AND cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?)
`;
    console.log("Executing query to update selected items:", query, [
      ...selectedCartItemIds,
      userId,
    ]);
    await db.execute(query, [...selectedCartItemIds, userId]);

    // Fetch selected items
    const [selectedItems] = await db.execute(
      `SELECT ci.cart_item_id, ci.quantity, itm.item_id, itm.item_name, itm.item_price
       FROM cart_items ci 
       JOIN cart c ON ci.cart_id = c.cart_id 
       JOIN item itm ON ci.item_id = itm.item_id 
       WHERE ci.selected = 1  AND c.user_id = ? AND ci.is_deleted = 0`,
      [userId]
    );

    console.log("Selected Items Retrieved:", selectedItems);

    if (selectedItems.length === 0) {
      console.log("No items found for the provided IDs.");
      return res
        .status(404)
        .json({
          error: "Selected items not found in the cart or have been deleted.",
        });
    }

    return res.status(200).json({ items: selectedItems });
  } catch (error) {
    console.error(
      "Error while transferring selected items to checkout:",
      error
    );
    return res
      .status(500)
      .json({ error: "Failed to transfer selected items to checkout" });
  }
};

// Fetch selected items in checkout
exports.getSelectedItemsInCheckout = async (req, res) => {
  const userId = req.user.user_id;
  try {
    const [selectedItems] = await db.execute(
      `SELECT ci.*, itm.item_name, itm.item_price 
       FROM cart_items ci 
       JOIN cart c ON ci.cart_id = c.cart_id 
       JOIN item itm ON ci.item_id = itm.item_id 
       WHERE c.user_id = ? AND ci.is_deleted = 0 AND ci.selected = 1`,
      [userId]
    );

    if (selectedItems.length === 0) {
      return res
        .status(404)
        .json({ error: "No selected items found in checkout." });
    }

    res.json({ items: selectedItems });
  } catch (error) {
    console.error("Error fetching selected items in checkout:", error);
    res.status(500).json({ error: "Failed to fetch selected items." });
  }
};

// Remove selected items from checkout and return them to the cart as unselected
exports.removeItemsFromCheckout = async (req, res) => {
  const { selectedCartItemIds } = req.body; 
  const userId = req.user.user_id; 

  // Validate input
  if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
    return res.status(400).json({ message: "No items provided for removal from checkout." });
  }

  try {
    console.log("Removing items from checkout:", selectedCartItemIds, "for user ID:", userId);

    // Prepare the SQL placeholders for the item IDs
    const placeholders = selectedCartItemIds.map(() => "?").join(",");

    // Update the `selected` status of the items to `0` (unselected)
    const query = `
      UPDATE cart_items
      SET selected = 0
      WHERE cart_item_id IN (${placeholders})
        AND cart_id IN (SELECT cart_id FROM cart WHERE user_id = ?)
        AND selected = 1
    `;

    // Execute the query
    const [result] = await db.execute(query, [...selectedCartItemIds, userId]);

    // Check if any rows were affected (i.e., items were actually updated)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No selected items found for removal." });
    }

    // Respond with a success message
    console.log("Items removed from checkout and marked as unselected.");
    res.status(200).json({ message: "Items successfully removed from checkout and marked as unselected." });
  } catch (error) {
    console.error("Error while removing items from checkout:", error.message);
    res.status(500).json({ message: "Failed to remove items from checkout.", error: error.message });
  }
};


// Calculate order summary for selected items in the cart
exports.calculateOrderSummary = async (selectedCartItemIds) => {
  if (!Array.isArray(selectedCartItemIds) || selectedCartItemIds.length === 0) {
    return res.status(400).json({ error: "No items selected" });
  }

  try {
    const placeholders = selectedCartItemIds.map(() => "?").join(",");
    const [selectedItems] = await db.execute(
      `SELECT ci.quantity, itm.item_price, itm.item_name
       FROM cart_items ci
       JOIN item itm ON ci.item_id = itm.item_id
       WHERE ci.cart_item_id IN (${placeholders}) AND ci.is_deleted = 0`,
      selectedCartItemIds
    );

    if (selectedItems.length === 0) {
      return res
        .status(404)
        .json({ error: "Selected items not found or already deleted" });
    }

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

    let totalAmount = 0;
    let totalQuantity = 0;

    selectedItems.forEach((item) => {
      const { quantity, item_price } = item;
      totalAmount += quantity * item_price;
      totalQuantity += quantity;
    });

    const discountAmount = (totalAmount * discountPercentage) / 100;
    const finalAmount = totalAmount - discountAmount;

    console.log("Calculated Order Summary:", {
      totalAmount,
      discountAmount,
      finalAmount,
    });

    return {
      totalAmount,
      discountAmount,
      finalAmount,
      totalQuantity,
    };
  } catch (err) {
    console.error("Error while calculating order summary:", err);
    res.status(500).json({ error: "Failed to calculate order summary" });
  }
};

//place an order
exports.placeOrder = async (req, res) => {
  const {
    selectedCartItemIds,
    first_name,
    last_name,
    address,
    city,
    postal_code,
    phone_number,
    cart_id,
  } = req.body;
  const userId = req.user.user_id;

  if (
    !cart_id ||
    !selectedCartItemIds ||
    !Array.isArray(selectedCartItemIds) ||
    selectedCartItemIds.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Cart ID and selected item IDs are required." });
  }

  if (
    !first_name ||
    !last_name ||
    !address ||
    !city ||
    !postal_code ||
    !phone_number
  ) {
    return res
      .status(400)
      .json({ error: "All delivery details must be provided" });
  }

  let connection;
  try {
    console.log("Placing order for user:", userId);

    connection = await db.getConnection();
    await connection.beginTransaction();
    console.log("Transaction started.");

    const placeholders = selectedCartItemIds.map(() => "?").join(",");

    console.log("Placing order for user:", userId);
    console.log("Selected Cart Item IDs:", selectedCartItemIds);
    console.log("Cart ID:", cart_id);

    const [items] = await connection.execute(
      `SELECT ci.item_id, ci.quantity, itm.item_price 
       FROM cart_items ci 
       JOIN cart c ON ci.cart_id = c.cart_id 
       JOIN item itm ON ci.item_id = itm.item_id 
       WHERE ci.cart_item_id IN (${placeholders}) 
         AND ci.cart_id = ? 
         AND ci.is_deleted = 0 
         AND ci.selected = 1 
         AND c.user_id = ?`,
      [...selectedCartItemIds, cart_id, userId]
    );

    console.log("Fetched items for order:", items);

    // Validate quantities
    const invalidItems = items.filter(
      (item) => item.quantity === null || item.quantity <= 0
    );
    if (invalidItems.length > 0) {
      console.warn(
        "Items with invalid or missing quantities found:",
        invalidItems
      );
      return res
        .status(400)
        .json({ error: "Some items have invalid or missing quantities." });
    }

    // Calculate total amounts by calling the existing function
    const { totalAmount, discountAmount, finalAmount } =
      await exports.calculateOrderSummary(selectedCartItemIds);

    // Create a new order
    const [orderResult] = await connection.execute(
      `INSERT INTO \`order\` (user_id, total_amount, order_status, cart_id,discount,final_amount,order_date) 
             VALUES (?, ?, 'Pending', ?,?,?,Now())`,
      [userId, totalAmount, cart_id, discountAmount, finalAmount]
    );
    const orderId = orderResult.insertId;

    // Add items to the order
    for (const item of items) {
      const { item_id, quantity, item_price } = item;
      console.log("Attempting to insert into order_items:", {
        orderId,
        item_id,
        quantity,
        item_price,
      });

      try {
        await connection.execute(
          `INSERT INTO order_items (order_id, item_id, quantity, item_price) VALUES (?, ?, ?, ?)`,
          [orderId, item_id, quantity, item_price]
        );
        console.log("Inserted item successfully:", { orderId, item_id });
      } catch (insertError) {
        console.error("Error inserting item into order_items:", insertError);
        throw insertError;
      }
    }

    // Store delivery details in order_details
    await connection.execute(
      `INSERT INTO order_details (order_id, address, city, postal_code, phone_number, first_name, last_name) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, address, city, postal_code, phone_number, first_name, last_name]
    );

    await connection.commit();
    res.json({
      message: "Order placed successfully",
      orderId,
      totalAmount,
      discountAmount,
      finalAmount,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error while placing order:", error);
    res.status(500).json({
      error: "Failed to place order",
    });
  } finally {
    if (connection) connection.release();
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
      "SELECT od.*, ord.user_id, ord.total_amount AS total_price, ord.discount, ord.final_amount AS final_total_price, ord.order_status FROM order_details od JOIN `order` ord ON od.order_id = ord.order_id WHERE od.order_id = ?",
      [orderId]
    );

    const [orderItems] = await db.execute(
      `SELECT oi.order_item_id,oi.quantity,oi.item_price,oi.item_id,oi.order_id,itm.item_name FROM order_items oi JOIN item itm ON oi.item_id=itm.item_id WHERE oi.order_id=?`,
      [orderId]
    );

    // Check if the order exists
    if (orderDetails.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

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
      "SELECT ord.order_id, GROUP_CONCAT(itm.item_name SEPARATOR ', ') AS item_names, ord.final_amount AS total_final_price, ord.order_status FROM `order` ord JOIN order_items orderItem ON ord.order_id = orderItem.order_id JOIN item itm ON orderItem.item_id = itm.item_id WHERE ord.is_deleted=0 GROUP BY ord.order_id"
    );

    // Formatting the results to a more structured response
    const formattedOrders = orders.map((order) => ({
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
      `SELECT COUNT(*) AS count FROM \`order\` WHERE is_deleted=0`
    );
    const pendingCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\` WHERE order_status = 'Pending' AND is_deleted=0`
    );
    const successfulCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\` WHERE order_status = 'Successful' AND is_deleted=0`
    );
    const failedCount = await db.execute(
      `SELECT COUNT(*) AS count FROM \`order\` WHERE order_status = 'Failed' AND is_deleted=0`
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
  const orderId = req.params.orderId;
  const { newStatus } = req.body;

  console.log("Updating order:", orderId, "with new status:", newStatus);

  try {
    await db.execute(
      `UPDATE \`order\` SET order_status = ? WHERE order_id = ?`,
      [newStatus.orderId]
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
