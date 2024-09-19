const Item=require('../models/itemModel');
const Category=require('../models/categoryModel');

//get all items based on category(pizza,cake,beverage)

exports.getItemsByCategory=async(req,res)=>{
    const {category_name}=req.params;

    try{
        //Find category by name
        const category=await Category.findByName(category_name);

        if(!category){
            return res.status(404).json({
                message:'Category not found'
            });
        }

        //fetch items by category_id
        const items=await Item.findByCategory(category.category_id);

        res.status(200).json(items);
    }catch(error){
        console.error('Error fetching items:',error);
        res.status(500).json({
            message:'Server error',error:error.message
        });
    }

};


//Add a new item (admin only)
exports.addItem=async (req,res)=>{

    console.log('Add item request received');
    const {item_name,item_description,item_price,item_image,category_name}=req.body;

    try{
        //Find category by name
        const category=await Category.findByName(category_name);

        if(!category){
            return res.status(400).json({
                message:'Invalid category'
            });
        }

        //Create item
        await Item.create({
            item_name,
            item_description,
            item_price,
            item_image,
            category_id:category.category_id
        });



        res.status(200).json({
            message:"Item added successfully"
        });
    }catch(error){
        console.error('Error adding item:',error);
        res.status(500).json({
            message:"Server error:",error:error.message
        });
    }
};


/* 

// Display the items on pizza page(frontend API)
fetch('http://localhost:5010/items/pizza')
    .then(response => response.json())
    .then(data => {
        // Render the items on the page
        console.log(data); // Display pizza items
    })
    .catch(error => {
        console.error('Error fetching pizza items:', error);
    });


*/