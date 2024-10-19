const db = require('../../config/db');


//add a new promotion(adminOnly)
exports.addPromotion=async(req,res)=>{
    const{title,promotion_description,discount_percentage,promotion_image,start_date,end_date}=req.body;


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
        'SELECT*FROM promotions WHERE CURDATE() BETWEEN start_date AND end_date'

    );
    res.status.json(promotions);
    }catch(error){
        console.error('Error fetching promotions:',error);
        res.status(500).json({
            error:'Failed to fetch promotions'
        });
    }
};
