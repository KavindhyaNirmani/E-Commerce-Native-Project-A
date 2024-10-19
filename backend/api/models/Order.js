const db=require('../../config');

class Order{

    //Create a new user
    static async createOrder(userId,cartId){
        const[result]=await db.execute(
          `INSERT INTO \`order\` (user_id, total_amount, order_status, cart_id) 
             VALUES (?, 0, 'Pending', ?)`,
             [userId,cartId]

        );
        //return the new orderId
        return result.insertId;
    }


    //update the total amount of the order
    static async updateTotalAmount(orderid,totalAmount){
        return db.execute(
            'UPDATE\'order\' SET total_amount=? WHERE order_id=?',
            [totalAmount,orderId]

        );
    }


    //Get all orders for a user
    static async getOrderByUser(userId){
        return db.execute(
          `SELECT * FROM \`order\` WHERE user_id = ? ORDER BY order_date DESC`,
            [userId]  
        );
    }


    //Get a specific order byID
    static async getOrderById(orderId){
        const[rows]=await db.execute(
            'SELECT*FROM\'order\' WHERE order_id=?',
            [orderId]
        );
        //return the first row
        return rows[0];
    }


}

module.exports=Order;
