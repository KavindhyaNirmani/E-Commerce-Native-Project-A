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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Admin-only route to add promotions
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("promotion_image"),
  promotionController.addPromotion
);

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
