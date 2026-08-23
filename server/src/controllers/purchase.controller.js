const { Op } = require("sequelize");

const Purchase = require("../models/purchase.model");
const Document = require("../models/document.model");

// =============================
// Get My Purchases
// =============================
const getMyPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      where: {
        student_id: req.user.id,
        status: "paid",
      },
      include: [
        {
          model: Document,
          as: "document",
          attributes: [
            "id",
            "title",
            "description",
            "subject",
            "price",
            "file_name",
          ],
        },
      ],
      order: [["purchased_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Purchased documents retrieved successfully",
      total: purchases.length,
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Admin - Get All Purchases
// =============================

// =============================
// Admin - Get All Purchases
// =============================

// =============================
// Admin - Get All Purchases
// =============================

const getAllPurchases = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const offset = (page - 1) * limit;

    // =============================
    // Get Paginated Purchases
    // =============================

    const { count, rows: purchases } =
      await Purchase.findAndCountAll({
        include: [
          {
            model: Document,
            as: "document",
            attributes: [
              "id",
              "title",
              "subject",
              "price",
            ],
          },
        ],

        order: [["created_at", "DESC"]],

        limit,
        offset,
      });

    // =============================
    // Get Statistics
    // =============================

    const allPurchases = await Purchase.findAll({
      attributes: [
        "status",
        "amount",
      ],
    });

    const totalTransactions = allPurchases.length;

    const paidPurchases = allPurchases.filter(
      (purchase) => purchase.status === "paid"
    );

    const pendingPurchases = allPurchases.filter(
      (purchase) => purchase.status === "pending"
    );

    const failedPurchases = allPurchases.filter(
      (purchase) => purchase.status === "failed"
    );

    const totalRevenue = paidPurchases.reduce(
      (total, purchase) =>
        total + Number(purchase.amount || 0),
      0
    );

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      message: "All purchases retrieved successfully",

      statistics: {
        totalPurchases: totalTransactions,
        paidPurchases: paidPurchases.length,
        pendingPurchases: pendingPurchases.length,
        failedPurchases: failedPurchases.length,
        totalRevenue,
      },

      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        limit,
      },

      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getMyPurchases,
  getAllPurchases,
};
