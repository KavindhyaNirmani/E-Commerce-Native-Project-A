// Middleware-middleware functions for authorization

//authMiddleware contains protect and adminOnly middleware for checking JWT and admin privileges.



const jwt =require('jsonwebtoken');




exports.protect = (req, res, next) => {
    console.log('Middleware protect executed');  // Debug log

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log('Token:', token);  // Debug log

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token verification failed:', error);  // Debug log
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