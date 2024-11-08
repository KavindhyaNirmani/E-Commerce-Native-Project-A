//routes defines the routes for API

//authRoutes define the routes for authentication ,login and admin actions.

const express = require("express");
const path = require("path");
const multer = require("multer");
const authController = require("../controllers/auth-controller");
const {
  protect,
  superAdminOnly,
  adminOrSuperAdmin,
  adminOnly,
} = require("../middleware/auth-middleware");
const router = express.Router(); //create a new instance of the Express Router

//const absolutePath = path.join('D:\\CODE PARK\\E_Com_Test\\int-24-2-a-ecom-native\\Frontend\\Assets\\UserImage');
const userImagePath = path.resolve(__dirname, "../../images/user-image");
console.log("Saving to:", userImagePath);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userImagePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//User registration
router.post("/register", authController.register);

//User/Admin login
router.post("/login", authController.login);

router.use("/images/user-image", express.static(userImagePath));

//Admin creation(-super-admin-only route)
router.post(
  "/add-admin",
  upload.single("user_image"),
  protect,
  superAdminOnly,
  authController.addAdmin
);

//Get all admins
router.get("/admins", protect, adminOrSuperAdmin, authController.getAllAdmins);

//Delete an admin by Id
router.delete(
  "/admins/:user_id",
  protect,
  superAdminOnly,
  authController.deleteAdmin
);

router.get("/", (req, res) => {
  res.json({
    message:
      "Auth routes are available for registration and login. Use /register or /login.",
  });
});

// Fetch all registered users (only accessible to admins and super-admins)
router.get("/users", protect, adminOrSuperAdmin, authController.getAllUsers);

module.exports = router;
