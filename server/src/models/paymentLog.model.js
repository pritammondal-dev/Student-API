const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PaymentLog = sequelize.define(
  "PaymentLog",
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

    purchase_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
  type: DataTypes.ENUM(
    "created",
    "success",
    "failed",
    "cancelled",
    "refunded"
  ),
  allowNull: false,
  defaultValue: "created",
},

    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "payment_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = PaymentLog;