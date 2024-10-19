const db = require('../../config/db');
const fs = require('fs');
const path = require('path');


//add a new promotion(adminOnly)
exports.addPromotion=async(req,res)=>{
    const{title,promotion_description,discount_percentage,start_date,end_date}=req.body;
    const promotionImage = req.file ? req.file.filename : null;


    try{
        await db.execute(
            'INSERT INTO promotion(title,promotion_description,discount_percentage,promotion_image,start_date,end_date) VALUES (?,?,?,?,?,?)',
            [title,promotion_description,discount_percentage,promotion_image,start_date,end_date]

        );
        res.status(201).json({
            message:'Promotion added succefully'
        });
    }catch(error){
        console.error('Error adding promotion:',error);
        res.status(500).json({
            error:'Failed to add promotion'
        });
    }
};




//get all active promotions
exports.getPromotions=async(req,res)=>{
    try{
    const[promotion]=await db.execute(
        `SELECT *, CONCAT('/assets/images/promotion/', promotion_image) AS promotion_image 
        FROM promotion 
        WHERE CURDATE() BETWEEN start_date AND end_date`

    );
    res.status.json(promotion);
    }catch(error){
        console.error('Error fetching promotions:',error);
        res.status(500).json({
            error:'Failed to fetch promotions'
        });
    }
};


// Delete a promotion and its image
exports.deletePromotion = async (req, res) => {
    const { promotionId } = req.params;

    try {
        // Get the image filename from the DB
        const [result] = await db.execute(
            `SELECT promotion_image FROM promotion WHERE promotion_id = ?`,
            [promotionId]
        );

        if (result.length === 0) {
            return res.status(404).json({ error: 'Promotion not found' });
        }

        const promotionImage = result[0].promotion_image;
        const imagePath = path.join(__dirname, '../../frontend/assets/images/promotion', promotionImage);

        // Delete the image file from the folder
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Error deleting image:', err);
        });

        // Delete the promotion from the DB
        await db.execute(`DELETE FROM promotion WHERE promotion_id = ?`, [promotionId]);

        res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        console.error('Error deleting promotion:', error);
        res.status(500).json({ error: 'Failed to delete promotion' });
    }
};
