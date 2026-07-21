require("dotenv").config();
require("./src/config/database"); // Import the database connection 

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});