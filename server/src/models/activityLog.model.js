const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_type: {
      type: DataTypes.ENUM("admin", "student"),
      allowNull: false,
    },

    action: {
      type: DataTypes.ENUM(
        "login",
        "logout",
        "failed_login"
      ),
      allowNull: false,
    },

    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = ActivityLog;