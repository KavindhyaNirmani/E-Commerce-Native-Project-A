const express = require("express");
const orderController = require("../controllers/order-controller");
const { protect } = require("../middleware/auth-middleware");
const router = express.Router();

//Place an order
router.post("/place", protect, orderController.placeOrder);

//Get all orders for a user
router.get("/user-orders", protect, orderController.getUserOrders);

//Get order details by Id
router.get("/order-details/:orderId", protect, orderController.getOrderDetails);

// Route for admins to fetch all orders along with their details
router.get("/admin/orders", orderController.getAllOrders);

// Route for admins to fetch order statistics (total, pending, successful, failed orders)
router.get("/admin/statistics", orderController.getOrderStatistics);

// Route for admins to update the status of a specific order
router.put("/admin/order-status", orderController.updateOrderStatus);

// Route for admins to delete a specific order by its ID
router.delete("/admin/delete/:orderId", orderController.deleteOrder);

module.exports = router;
