//routes defines the routes for API

//authRoutes define the routes for authentication ,login and admin actions.

const express=require('express');
const path=require('path');
const multer=require('multer');
const authController=require('../controllers/auth-controller');
const {protect,adminOnly}= require('../middleware/auth-middleware');
const router=express.Router();//create a new instance of the Express Router



//const absolutePath = path.join('D:\\CODE PARK\\E_Com_Test\\int-24-2-a-ecom-native\\Frontend\\Assets\\UserImage');
const userImageAssetsPath = path.resolve(__dirname, '../../../frontend/assets/images/user-image');
console.log('Saving to:', userImageAssetsPath);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, userImageAssetsPath);  
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload =multer({storage:storage});





//User registration
router.post('/register',authController.register);

//User/Admin login
router.post('/login',authController.login);

router.use('/assets/images/user-image', express.static(userImageAssetsPath));

//Admin creation(admin-only route)
router.post('/add-admin',  upload.single('user_image'), authController.addAdmin);


//Get all admins
router.get('/admins',authController.getAllAdmins);

//Delete an admin by Id
router.delete('/admins/:user_id',protect,adminOnly,authController.deleteAdmin);



module.exports=router;

