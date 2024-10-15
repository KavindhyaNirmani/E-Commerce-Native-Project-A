//controller handles the business logic for each routes.

// authcontroller contains the user registration a,login and admin creation login.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const multer = require('multer');
const path = require('path');


// Register a new user (only user can register via form)
exports.register = async (req, res) => {//exported asynchronous function to be used as the handler for the registration route
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }
 // To Ensure all required fields are properly passed
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }


    try {

        // Check if the user is already registered
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        
        // Hash Password+
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create user (role is 'user' by default)
        
        await User.create({ username :username|| null, email:email||null, password: hashedPassword ||null, role: 'user' });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





// Login for both users and admin
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Password' });
        }

        console.log('User role from DB:', user.role); 

        // Create and return JWT token with role information
        const token = jwt.sign(//generates a JWT token using the user's id and role
            { userId: user.user_id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            token,
            role: user.role,
            message: user.role === 'admin' ? 'Admin logged in' : 'User logged in',
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

function checkMissingFields(body, requiredFields) {
    const missingFields = requiredFields.filter(field => !body[field]);
    return missingFields;
}




// Add new admin (only admins can add another admin)
exports.addAdmin = async (req, res) => {
    console.log('Request Body:', req.body);
    console.log('File:', req.file); // Log the file to verify if it's being uploaded

    const { first_name, last_name, username, email, password, phone_no, address } = req.body;
    const user_image =  `/assets/images/user-image/${req.file.filename}`;

    try {
        // Check for missing fields
        const missingFields = checkMissingFields(req.body, ['first_name', 'last_name', 'username', 'email', 'password']);
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                message: 'Required fields are missing', 
                missingFields 
            });
        }

        // Check if the admin already exists
        const existingAdmin = await User.findByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password for admin
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create admin (role is 'admin')
        const newAdmin = {
            first_name: first_name || null,  // Ensure we are using null if undefined
            last_name: last_name || null,
            username: username || null,
            email: email || null,
            password: hashedPassword,
            phone_no: phone_no || null,
            address: address || null,
            user_image: req.file ? req.file.filename : null, // Assign the file name from multer
            role: 'admin' 
        };

        await User.createAdmin(newAdmin);

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Add admin error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




// Function to check for missing fields
function checkMissingFields(body, requiredFields) {
    const missingFields = [];
    requiredFields.forEach(field => {
        if (!body[field]) {
            missingFields.push(field);
        }
    });
    return missingFields;
}





exports.getAllAdmins=async(req,res)=>{
    try{
        const admins=await User.findAllAdmins();
        res.status(200).json({
            status:'success',data:admins
        });
    }catch(error){
        console.error('Error fetching admins:',error);
        res.status(500).json({
            message:'server error',error:error.message
        });
    }
};




exports.deleteAdmin=async(req,res)=>{
    const{user_id}=req.params;
    try{
        await User.deleteById(user_id);
        res.status(200).json({
            message:'Admin deleted successfully'
        });
    }catch(error){
        console.error('Error deleting admin:',error);
        res.status(500).json({
            message:'server error',error:error.message
        });
    }

};

