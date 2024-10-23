const db = require("../../config/db");

class Promotion {
  // Create a new promotion with associated rules
  static async create(promotionData, rules) {
    const {
      title,
      promotion_description,
      promotion_image,
      start_date,
      end_date,
      categories,
    } = promotionData;

    const connection = await db.getConnection(); // Use transaction

    try {
      await connection.beginTransaction();

      const [result] = await connection.execute(
        "INSERT INTO promotion (title, promotion_description, promotion_image, start_date, end_date,categories) VALUES (?, ?, ?, ?, ?, ?)",
        [
          title,
          promotion_description,
          promotion_image,
          start_date,
          end_date,
          categories,
        ]
      );

      const promotion_id = result.insertId;

      // Insert associated rules
      for (const rule of rules) {
        await connection.execute(
          `INSERT INTO promotion_rule (promotion_id, min_price, discount_percentage) 
          VALUES (?, ?, ?)`,
          [promotion_id, rule.min_price, rule.discount_percentage]
        );
      }

      await connection.commit();

      return {
        promotion_id,
        title,
        promotion_description,
        promotion_image,
        start_date,
        end_date,
        categories,
        rules,
      };
    } catch (error) {
      await connection.rollback();
      throw new Error("Error creating promotion: " + error.message);
    } finally {
      connection.release();
    }
  }

  // Get all active promotions with associated rules
  static async findAll() {
    try {
      const [promotions] = await db.execute(`SELECT * FROM promotion`);

      const promotionIds = promotions.map((promo) => promo.promotion_id);
      if (!promotionIds.length) return promotions;

      const [rules] = await db.execute(
        `SELECT * FROM promotion_rule WHERE promotion_id IN (?)`,
        [promotionIds]
      );

      // Group rules by promotion_id
      const groupedRules = rules.reduce((acc, rule) => {
        acc[rule.promotion_id] = acc[rule.promotion_id] || [];
        acc[rule.promotion_id].push(rule);
        return acc;
      }, {});

      return promotions.map((promo) => ({
        ...promo,
        rules: groupedRules[promo.promotion_id] || [],
      }));
    } catch (error) {
      throw new Error("Error fetching promotions: " + error.message);
    }
  }

  // Find promotion by ID with rules
  static async findById(promotionId) {
    try {
      const [promotionResults] = await db.execute(
        "SELECT * FROM promotion WHERE promotion_id = ?",
        [promotionId]
      );

      const promotion = promotionResults[0];

      if (!promotion) return null;

      const [rules] = await db.execute(
        `SELECT * FROM promotion_rule WHERE promotion_id = ?`,
        [promotionId]
      );

      promotion.rules = rules;
      return promotion;
    } catch (error) {
      throw new Error("Error fetching promotion: " + error.message);
    }
  }

  // Delete a promotion and its rules by ID
  static async deleteById(promotionId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        `DELETE FROM promotion_rule WHERE promotion_id = ?`,
        [promotionId]
      );

      await connection.execute(`DELETE FROM promotion WHERE promotion_id = ?`, [
        promotionId,
      ]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw new Error("Error deleting promotion: " + error.message);
    } finally {
      connection.release();
    }
  }
}

module.exports = Promotion;
