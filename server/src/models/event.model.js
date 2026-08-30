const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
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
      allowNull: true,
    },

    event_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    event_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    registration_link: {
      type: DataTypes.STRING(500),
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
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Event;