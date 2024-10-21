const Promotion = require("../models/Promotion");
const db = require("../../config/db");

// Get all active promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.findAll();
    res.status(200).json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get a single promotion by its ID
exports.getPromotionById = async (req, res) => {
  const { promotionId } = req.params;

  try {
    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
      return res.status(404).json({
        message: "Promotion not found",
      });
    }

    res.status(200).json(promotion);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Add a new promotion
exports.addPromotion = async (req, res) => {
  console.log("Add promotion request received");

  const {
    title,
    promotion_description,
    discount_percentage,
    start_date,
    end_date,
  } = req.body;
  const promotion_image = req.file
    ? `/assets/images/promotion/${req.file.filename}`
    : null;

  try {
    const promotion = await Promotion.create({
      title,
      promotion_description,
      discount_percentage,
      promotion_image,
      start_date,
      end_date,
    });

    res.status(201).json({
      message: "Promotion added successfully",
      promotion,
    });
  } catch (error) {
    console.error("Error adding promotion:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete a promotion by ID
exports.deletePromotion = async (req, res) => {
  const { promotionId } = req.params;

  console.log(`Request to delete promotion with ID: ${promotionId}`);

  try {
    const result = await Promotion.deleteById(promotionId);
    console.log("Delete result:", result);
    res.status(204).send("Promotion deleted successfully");
  } catch (error) {
    console.error("Error deleting promotion:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
