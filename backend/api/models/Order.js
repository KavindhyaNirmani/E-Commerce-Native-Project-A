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


}

module.exports=Order;
