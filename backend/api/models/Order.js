const db = require("../../config");

class Order {
  //Create a new user
  static async createOrder(userId, cartId) {
    const [result] = await db.execute(
      `INSERT INTO \`order\` (user_id, total_amount, order_status, cart_id) 
             VALUES (?, 0, 'Pending', ?)`,
      [userId, cartId]
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
      "SELECT o.order_id,i.item_name,oi.item_price AS final_price,o.order_status FROM 'order' 0 JOIN order_items oi ON o.order_id=oi.order_id JOIN item i ON oi.item_id=i.item_id"
    );
    return results;
  }

  //Count orders by status
  static async countOrdersByStatus(status) {
    const [results] = await db.execute(
      "SELECT COUNT(*) AS count FROM 'order' WHERE order_status=?",[status]
    );
    return results[0].count;
  }
}

module.exports = Order;
