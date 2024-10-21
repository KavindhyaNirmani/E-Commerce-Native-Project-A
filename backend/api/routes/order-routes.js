const express = require("express");
const orderController = require("../controllers/order-controller");
const { protect } = require("../middleware/auth-middleware");
const router = express.Router();

//Place an order
router.post("/place", protect, orderController.placeOrder);

//Get all orders for a user
router.get("/", protect, orderController.getUserOrders);

//Get order details by Id
router.get("/:orderId", protect, orderController.getOrderDetails);

module.exports = router;
