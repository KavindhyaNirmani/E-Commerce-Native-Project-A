const db=require('../../config/db');

class OrderItems{
    //Insert items into the order_items table
    static async addItemToOrder(orderId,itemId,quantity,itemPrice){
        return db.execute(
            'INSER INTO order_items (order_id,item_id,quantity,item_price) VALUES (?,?,?,?)',
            [orderId,itemId,quantity,itemPrice]
            
        );
    }


    //Get all items for a specific order
    static async getItemsByOrderId(orderId){
        return db.execute(
            `SELECT oi.*, i.item_name 
             FROM order_items oi 
             JOIN item i ON oi.item_id = i.item_id 
             WHERE oi.order_id = ?`,
            [orderId]
        );
    }
}

module.exports=OrderItems;
