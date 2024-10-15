// Middleware-middleware functions for authorization

//authMiddleware contains protect and adminOnly middleware for checking JWT and admin privileges.

const jwt =require('jsonwebtoken');




exports.protect = (req, res, next) => {
    console.log('Middleware protect executed'); 

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token received:', token); 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { user_id: decoded.userId, role: decoded.role };
            console.log('User authenticated:', req.user);
            next();
        } catch (error) {
            console.error('Token verification failed:', error); 
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
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