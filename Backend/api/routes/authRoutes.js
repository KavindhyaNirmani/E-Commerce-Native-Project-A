//routes defines the routes for API

//authRoutes define the routes for authentication ,login and admin actions.

const express=require('express');
const authController=require('../controllers/authController');
const {protect,adminOnly}= require('../middleware/authMiddleware');

const router=express.Router();//create a new instance of the Express Router

//User registration
router.post('/register',authController.register);

//User/Admin login
router.post('/login',authController.login);

//Admin creation(admin-only route)
router.post('/add-admin',protect,adminOnly,authController.addAdmin);

module.exports=router;

