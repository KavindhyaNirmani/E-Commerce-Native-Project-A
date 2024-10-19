const express = require('express');
const { protect, adminOnly } = require('../middleware/auth-middleware');
const promotionController = require('../controllers/promotion-controller');
const multer= require('multer');

const router = express.Router();

// Admin-only route to add promotions
router.post('/', protect, adminOnly, promotionController.addPromotion);

// Public route to get active promotions
router.get('/', promotionController.getPromotions);

// Admin-only route to delete a promotion by ID
router.delete('/:promotionId', protect, adminOnly, promotionController.deletePromotion);

module.exports = router;
