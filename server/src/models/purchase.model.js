const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Purchase = sequelize.define(
  "Purchase",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    document_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "failed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending",
    },

    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    purchased_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "purchases",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Purchase;