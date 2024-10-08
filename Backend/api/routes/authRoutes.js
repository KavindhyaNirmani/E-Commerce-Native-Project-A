//routes defines the routes for API

//authRoutes define the routes for authentication ,login and admin actions.

const express=require('express');
const path=require('path');
const multer=require('multer');
const authController=require('../controllers/authController');
const {protect,adminOnly}= require('../middleware/authMiddleware');
<<<<<<< HEAD
const upload = authController.upload;
=======


>>>>>>> origin/main
const router=express.Router();//create a new instance of the Express Router

const absolutePath = path.join('D:\\CODE PARK\\E_Com_Test\\int-24-2-a-ecom-native\\Frontend\\Assets\\UserImage');


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




//User registration
router.post('/register',authController.register);

//User/Admin login
router.post('/login',authController.login);

router.use('/Assets/UserImage', express.static(absolutePath));

//Admin creation(admin-only route)
router.post('/add-admin', protect, adminOnly, upload.single('user_image'), authController.addAdmin);


//Get all admins
router.get('/admins',protect,adminOnly,authController.getAllAdmins);

//Delete an admin by Id
router.delete('/admins/:user_id',protect,adminOnly,authController.deleteAdmin);
module.exports=router;

