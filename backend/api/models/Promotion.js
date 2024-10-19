const db = require('../../config/db');

class Promotion {
    // Create a new promotion
    static async create(promotionData) {
        const { title, promotion_description, discount_percentage, promotion_image, start_date, end_date } = promotionData;

        try {
            const [result] = await db.execute(
                'INSERT INTO promotion (title, promotion_description, discount_percentage, promotion_image, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
                [title, promotion_description, discount_percentage, promotion_image, start_date, end_date]
            );
            return { promotion_id: result.insertId, title, promotion_description, discount_percentage, promotion_image, start_date, end_date };
        } catch (error) {
            throw new Error('Error creating promotion: ' + error.message);
        }
    }

    // Get all active promotions
    static async findAll() {
        try {
            const [results] = await db.execute('SELECT * FROM promotion');
            console.log('Fetched promotions:', results); 
            return results;
        } catch (error) {
            throw new Error('Error fetching promotions: ' + error.message);
        }
    }

    // Find promotion by ID
    static async findById(promotionId) {
        try {
            const [results] = await db.execute('SELECT * FROM promotion WHERE promotion_id = ?', [promotionId]);
            return results[0] || null;
        } catch (error) {
            throw new Error('Error fetching promotion: ' + error.message);
        }
    }

    // Delete a promotion by ID
    static async deleteById(promotionId) {
        try {
            await db.execute('DELETE FROM promotion WHERE promotion_id = ?', [promotionId]);
        } catch (error) {
            throw new Error('Error deleting promotion: ' + error.message);
        }
    }
}

module.exports = Promotion;
