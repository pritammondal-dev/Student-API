const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notice = sequelize.define(
  "Notice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "general",
    },

    publish_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    is_published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "notices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Notice;