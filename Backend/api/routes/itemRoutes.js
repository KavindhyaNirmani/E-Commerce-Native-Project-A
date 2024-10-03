const express=require('express');
const itemController=require('../controllers/itemController');
const{protect,adminOnly}=require('../middleware/authMiddleware');
const multer= require('multer');

const path = require('path');


const router=express.Router();

const absolutePath = path.join('D:\\CODE PARK\\E_Com_Test\\int-24-2-a-ecom-native\\Frontend\\Assets\\Menu');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, absolutePath);  // Use absolute path to Frontend/Assets
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);// Generate unique filename. Because if different time or different user add files with same name
        cb(null, uniqueSuffix + '-' + file.originalname);  
    }
});


const upload =multer({storage:storage});



//Fetch items by category(pizza,cake,beverage)
router.get('/category/:category_name',itemController.getItemsByCategory);


/// Fetch all items
router.get('/', itemController.getAllItems);

// Fetch a single item by its ID
router.get('/:item_id', itemController.getItemById);

router.use('/Assets/Menu', express.static(absolutePath));

// Add a new item (with image upload)
router.post('/', protect, adminOnly, upload.single('item_image'), itemController.addItem);

// Update an item (with image upload)
router.put('/:item_id', protect, adminOnly, upload.single('item_image'), itemController.updateItem);

// Delete an item (soft delete)
router.delete('/:item_id', protect, adminOnly, itemController.deleteItem);


module.exports=router;