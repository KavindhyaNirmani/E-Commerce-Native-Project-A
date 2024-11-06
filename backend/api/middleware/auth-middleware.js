// Middleware-middleware functions for authorization

//authMiddleware contains protect and adminOnly middleware for checking JWT and admin privileges.

const jwt = require("jsonwebtoken");

exports.superAdminOnly = (req, res, next) => {
  if (req.user.role !== "super admin") {
    return res.status(403).json({
      message: "Access denied, super admins only",
    });
  }
  next();
};

// Modify adminOnly middleware to allow admins to view admins but restrict add/delete actions
exports.adminViewOnly = (req, res, next) => {
  if (req.user.role === "admin" && !["GET"].includes(req.method)) {
    return res.status(403).json({
      message: "Access denied, admins can only view admins",
    });
  }
  next();
};

// Middleware to allow access for admin and super admin
exports.adminOrSuperAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(403).json({
      message: "Access denied, admins or super admins only",
    });
  }
  next();
};

exports.protect = (req, res, next) => {
  console.log("Middleware protect executed");

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { user_id: decoded.userId, role: decoded.role };
      console.log("User authenticated:", req.user);
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

//Middleware to restrict routes to admins only
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied, admins only",
    });
  }
  next();
};
