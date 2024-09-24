// models foe deals with the database logic and abstraction

//userModels for define methods for interacting with the user.



const db = require('../../config/db');

class User {
    // Find user by email
    static async findByEmail(email) {
        try {
            const [result] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
            return result[0];
        } catch (error) {
            throw new Error('Error finding user by email: ' + error.message);
        }
    }



    // Find user by username
    static async findByUsername(username) {
        try {
            const [result] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
            return result[0];
        } catch (error) {
            throw new Error('Error finding user by username: ' + error.message);
        }
    }

    // Create a new user
    static async create(userData) {
        const { username, email, hashedPassword, role } = userData;
        try {
            await db.execute(//send the sql queries to the database
                'INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, role]
            );
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Create a new admin (only accessible to current admins)
    static async createAdmin(adminData) {
        const { username, email, hashedPassword } = adminData;
        try {
            await db.execute(
                'INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)',
                [username, email, hashedPassword, 'admin']
            );
        } catch (error) {
            throw new Error('Error creating admin: ' + error.message);
        }
    }
}

module.exports = User;
