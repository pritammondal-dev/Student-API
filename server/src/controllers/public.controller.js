const Document = require("../models/document.model");

// =============================
// Get Public Notes Shop
// =============================
const getPublicDocuments = async (req, res, next) => {
  try {
    const page = Math.max(
      parseInt(req.query.page) || 1,
      1
    );

    const requestedLimit =
      parseInt(req.query.limit) || 10;

    const allowedLimits = [5, 10, 20, 50];

    const limit = allowedLimits.includes(requestedLimit)
      ? requestedLimit
      : 10;

    const offset = (page - 1) * limit;

    const { count, rows: documents } =
      await Document.findAndCountAll({
        attributes: [
          "id",
          "title",
          "description",
          "subject",
          "price",
          "created_at",
          "updated_at",
        ],
        order: [["id", "DESC"]],
        limit,
        offset,
      });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      message: "Public documents retrieved successfully",
      data: documents,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicDocuments,
};