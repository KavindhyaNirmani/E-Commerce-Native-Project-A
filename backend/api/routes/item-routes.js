const express = require("express");
const itemController = require("../controllers/item-controller");
const { protect,adminOrSuperAdmin } = require("../middleware/auth-middleware");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const menuPath = path.resolve(__dirname, "../../images/menu");
console.log("Saving to:", menuPath);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, menuPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//Fetch items by category(pizza,cake,beverage)
router.get("/category/:category_name", itemController.getItemsByCategory);

// Fetch all items
router.get("/", protect,adminOrSuperAdmin,itemController.getAllItems);

// Fetch a single item by its ID
router.get("/:item_id", protect,itemController.getItemById);

router.use("/images/menu", express.static(menuPath));

// Add a new item (with image upload)
//router.post('/', protect, adminOnly, upload.single('item_image'), itemController.addItem);

router.post("/", upload.single("item_image"), itemController.addItem);

// Update an item (with image upload)
router.put("/:item_id", upload.single("item_image"), protect,adminOrSuperAdmin, itemController.updateItem);

// Delete an item (soft delete)
router.delete("/:item_id", protect,adminOrSuperAdmin, itemController.deleteItem);

module.exports = router;
