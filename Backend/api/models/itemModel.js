const db=require('../../config/db');

class item{
    //Find item by category
    static async findByCategory(category_id){
        try{
            const [results]=await db.execute('SELECT*FROM items WHERE category_id=?',[category_id]);
            return results;
        }catch(error){
            throw new Error('Error finding items'+error.message);
        }
    }


    //Add a new item(Admin's feature)
    static async create(itemData){
      const {item_name,item_description,item_price,item_image,category_id}=itemData;

      try{
        await db.execute('INSERT INTO items(item_name,item_description,item_price,item_image,category_id ) VALUES(?,?,?,?,?)',
            [item_name,item_description,item_price,item_image,category_id]
        );
      }catch(error){
        throw new Error('Error adding new item:'+error.message);

      }

    }
}


module.exports=item;