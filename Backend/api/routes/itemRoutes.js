const express=require('express');
const itemController=require('../controllers/itemController');
const{protect,adminOnly}=require('../middleware/authMiddleware');
const multer= require('multer');
const path = require('path');


const router=express.Router();

const absolutePath = path.join(__dirname, 'Frontend/Assets');

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
router.get('/:category_name',itemController.getItemsByCategory);

router.use('/Assets', express.static(path.join(__dirname, '../Frontend/Assets')));

/// Fetch all items
router.get('/', itemController.getAllItems);

// Add a new item (with image upload)
router.post('/', protect, adminOnly, upload.single('item_image'), (req, res, next) => {
    // Add the relative image path to the request body
    if (req.file) {
        req.body.item_image = `/Assets/${req.file.filename}`;
    }
    next();
}, itemController.addItem);

// Update an item (with image upload)
router.put('/:item_id', protect, adminOnly, upload.single('item_image'), (req, res, next) => {
    // Update the image path if a new image is uploaded
    if (req.file) {
        req.body.item_image = `/Assets/${req.file.filename}`;
    }
    next();
}, itemController.updateItem);

// Delete an item (soft delete)
router.delete('/:item_id', protect, adminOnly, itemController.deleteItem);


module.exports=router;