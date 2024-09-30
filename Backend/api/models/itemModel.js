const db=require('../../config/db');
const fs =require('fs');
const path=require('path');


class Item{
    //Find item by category
    static async findByCategory(category_id){
        try{
            const [results]=await db.execute('SELECT*FROM item WHERE category_id=?',[category_id]);
            return results;
        }catch(error){
            throw new Error('Error finding items'+error.message);
        }
    }

    // Get all items (excluding soft deleted ones)
    static async findAll() {
      try {
          const [results] = await db.execute('SELECT * FROM item WHERE is_deleted = 0');
          return results;
      } catch (error) {
          throw new Error('Error fetching items: ' + error.message);
      }
    }




    //Add a new item(Admin's feature)
    static async create(itemData){
      const {item_name,item_description,item_price,item_image,category_id}=itemData;

      try{
        await db.execute('INSERT INTO item(item_name,item_description,item_price,item_image,category_id ) VALUES(?,?,?,?,?)',
            [item_name,item_description,item_price,`/Assets/${item_image}`,category_id]
        );
      }catch(error){
        throw new Error('Error adding new item:'+error.message);

      }

    }


    // Update an item (handle undefined values explicitly)
    static async update(item_id, itemData) {
      const { item_name, item_description, item_price, item_image, category_id } = itemData;
  
      try {
          const query = `
              UPDATE item
              SET
                  item_name = COALESCE(?, item_name),
                  item_description = COALESCE(?, item_description),
                  item_price = COALESCE(?, item_price),
                  category_id = COALESCE(?, category_id),
                  item_image = COALESCE(?, item_image)
              WHERE item_id = ? AND is_deleted = 0
          `;
  
          await db.execute(query, [
              item_name !== undefined ? item_name : null,
              item_description !== undefined ? item_description : null,
              item_price !== undefined ? item_price : null,
              category_id !== undefined ? category_id : null,
              item_image !== undefined ? `/Assets/${item_image}` : null,
              item_id
          ]);
      } catch (error) {
          throw new Error('Error updating item: ' + error.message);
      }
  }
  


    //Soft delete an item
    static async softDelete(item_id){
      try{await db.execute('UPDATE item SET is_deleted=1 WHERE item_id=?',[item_id]);

      }catch(error){
        throw new Error('Error deleting item:' + error.message);
      }
    }
}


module.exports=Item;