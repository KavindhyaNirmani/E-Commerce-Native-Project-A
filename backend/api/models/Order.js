const db = require("../../config");

class Order {
  //Create a new user
  static async createOrder(userId, totalAmount, cartId) {
    const [result] = await db.execute(
      `INSERT INTO \`order\` (user_id, total_amount, order_status, cart_id) 
             VALUES (?, ?, 'Pending', ?)`,
      [userId, , totalAmount, cartId]
    );
    //return the new orderId
    return result.insertId;
  }

  //update the total amount of the order
  static async updateTotalAmount(orderId, totalAmount) {
    return db.execute(`UPDATE \`order\` SET total_amount=? WHERE order_id=?`, [
      totalAmount,
      orderId,
    ]);
  }

  //Get all orders for a user
  static async getOrderByUser(userId) {
    return db.execute(
      `SELECT * FROM \`order\` WHERE user_id = ? ORDER BY order_date DESC`,
      [userId]
    );
  }

  //Get a specific order byID
  static async getOrderById(orderId) {
    const [rows] = await db.execute("SELECT * FROM 'order' WHERE order_id=?", [
      orderId,
    ]);
    //return the first row
    return rows[0];
  }

  //Get all orders with item names and final prices
  static async getAllOrders() {
    const [results] = await db.execute(
      "SELECT ord.order_id, GROUP_CONCAT(itm.item_name SEPARATOR ', ') AS item_names, ord.final_amount AS final_price, ord.order_status FROM `order` ord JOIN order_items orderItem ON ord.order_id = orderItem.order_id JOIN item itm ON orderItem.item_id = itm.item_id GROUP BY ord.order_id"
    );
    return results;
  }

  //Count orders by status
  static async countOrdersByStatus(status) {
    const [results] = await db.execute(
      "SELECT COUNT(*) AS count FROM 'order' WHERE order_status=?",
      [status]
    );
    return results[0].count;
  }
}

module.exports = Order;
