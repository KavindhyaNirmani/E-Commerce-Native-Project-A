const express=require('express');
const itemController=require('../controllers/itemController');
const{protect,adminOnly}=require('../middleware/authMiddleware');


const router=express.Router();

//Fetch items by category(pizza,cake,beverage)
router.get('/:category_name',itemController.getItemsByCategory);


//Add a new item(Admin only)
router.post('/', protect,adminOnly,itemController.addItem);


module.exports=router;