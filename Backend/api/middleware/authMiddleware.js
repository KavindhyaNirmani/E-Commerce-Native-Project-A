// Middleware-middleware functions for authorization

//authMiddleware contains protect and adminOnly middleware for checking JWT and admin privileges.



const jwt =require('jsonwebtoken');

exports.protect=(req,res,next)=>{
    const token=req.header('Authorization').replace('Bearer','');

    if(!token){
        return res.status(401).json({
            message:'No token,authorization denied'
        });

    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SCRET);
        req.user=decoded;
        next();
    }catch(error){
        res.status(401).json({
            message:'Token is not valid'
        });
    }
};



//Middleware to restrict routes to admins only
exports.adminOnly=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({
            message:'Access denied, admins only'
        });
    }
    next();
};