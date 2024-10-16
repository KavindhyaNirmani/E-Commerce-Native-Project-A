const db = require('../../config/db');

class CartItem{
    //Add a new item to the cart
    static async addItem (cartId,itemId,quantity){
        try{
            const [result]=await db.execute('INSERT INTO cart_items (cart_id,item_id,quantity) VALUES (?,?,?)',[cartId,itemId,quantity]               
                
            );
            return result.insertId;//Return the new cart_item's ID
        }catch(error){
            throw new Error('Error adding item to cart:'+error.message);
        }
    }



    //Get all items in a cart by cart ID
    static async getItemsByCartId(cartId){
        try{
            const[result]=await db.execute('SELECT ci.cart_item_id,ci.quantity,i.item_name,i.item_price,i.item_image FROM cart_items ci JOIN item i ON ci.item_id= i.item_id WHERE ci.cart_id=?',[cartId]);
            return result;//return the list of cart items
        }catch(error){
            throw new Error('Error fetching items in cart:'+error.message);
        }
    }


    //Delete an item from the cart
    static async deleteItem(cartItemId) {
        try {
            console.log('Executing DELETE query for cart_item_id:', cartItemId);

            // Execute the DELETE query
            const [result] = await db.execute(
                'DELETE FROM cart_items WHERE cart_item_id = ?',
                [cartItemId]
            );

            console.log('DELETE result:', result); // Log the full result
            return result.affectedRows; // Return affected rows count

        } catch (error) {
            console.error('Error executing DELETE query:', error.message);
            throw new Error('Error deleting item from cart: ' + error.message);
        }
    }

}



module.exports = CartItem;