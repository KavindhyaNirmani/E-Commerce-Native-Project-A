const express = require("express");
const { protect, adminOnly } = require("../middleware/auth-middleware");
const promotionController = require("../controllers/promotion-controller");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set up the storage for images
const promotionAssetsPath = path.resolve(
  __dirname,
  "../../../frontend/assets/images/promotion"
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, promotionAssetsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
      file.originalname
    }`;
    cb(null, uniqueSuffix);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Admin-only route to add promotions
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("promotion_image"),
  promotionController.addPromotion
);

router.post("/apply", promotionController.applyPromotion);

// Public route to get active promotions
router.get("/", promotionController.getAllPromotions);

// Admin-only route to fetch a promotion by ID
router.get("/:promotionId", promotionController.getPromotionById);

// Admin-only route to delete a promotion by ID
router.delete(
  "/:promotionId",
  protect,
  adminOnly,
  promotionController.deletePromotion
);

module.exports = router;
