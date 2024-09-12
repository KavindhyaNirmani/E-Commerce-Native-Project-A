//controller handles the business logic for each routes.

// authcontroller contains the user registration a,login and admin creation login.


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user (only user can register via form)
exports.register = async (req, res) => {//exported asynchronous function to be used as the handler for the registration route
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // Check if the user is already registered
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create user (role is 'user' by default)
        await User.create({ username, email, hashedPassword, role: 'user' });

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

        // Create and return JWT token with role information
        const token = jwt.sign(//generates a JWT token using the user's id and role
            { userId: user.id, role: user.role },
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

// Add new admin (only admins can add another admin)
exports.addAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the admin already exists
        const existingAdmin = await User.findByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash password for admin
        const hashedPassword = await bcrypt.hash(password, 8);

        // Create admin (role is 'admin')
        await User.createAdmin({ username, email, hashedPassword });

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error('Add admin error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
