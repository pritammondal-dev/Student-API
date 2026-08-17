const ActivityLog = require("../models/activityLog.model");

const createActivityLog = async ({
  userId,
  userType,
  action,
  req,
}) => {
  try {
    await ActivityLog.create({
      user_id: userId,
      user_type: userType,
      action,
      ip_address:
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        null,
      user_agent: req.headers["user-agent"] || null,
    });
  } catch (error) {
    // Don't break login/logout if logging fails
    console.error("Activity log error:", error.message);
  }
};

module.exports = createActivityLog;