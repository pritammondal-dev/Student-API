const { Op } = require("sequelize");
const ActivityLog = require("../models/activityLog.model");

// =============================
// Get Activity Logs
// Admin Only
// =============================
const getActivityLogs = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100,
    );

    const search = String(req.query.search || "").trim();
    const action = String(req.query.action || "all").trim();

    const offset = (page - 1) * limit;

    // =============================
    // Filter
    // =============================

    const where = {};

    if (
      action &&
      ["login", "logout", "failed_login"].includes(action)
    ) {
      where.action = action;
    }

    if (search) {
      where[Op.or] = [
        {
          user_id: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          user_type: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          action: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          ip_address: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // =============================
    // Paginated Logs
    // =============================

    const { count, rows: logs } =
      await ActivityLog.findAndCountAll({
        where,
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });

    // =============================
    // Global Statistics
    // =============================

    const totalActivities = await ActivityLog.count();

    const loginActivities = await ActivityLog.count({
      where: {
        action: "login",
      },
    });

    const failedLogins = await ActivityLog.count({
      where: {
        action: "failed_login",
      },
    });

    // =============================
    // Pagination
    // =============================

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,

      message: "Activity logs retrieved successfully",

      total: count,

      statistics: {
        totalActivities,
        loginActivities,
        failedLogins,
      },

      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        limit,
      },

      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivityLogs,
};