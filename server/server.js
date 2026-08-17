require("dotenv").config();

const sequelize = require("./src/config/database");

// Load Models
// Load Models and Associations
require("./src/models");

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // Synchronize models with the database
    await sequelize.sync();
    console.log("✅ Models synchronized successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();