const mysql =require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to MySQL
connection.connect((err) =>{
    if (err) {
        console.error("Error connecting to MySQL database:", err);
        process.exit(1);
    }

    console.log("Connected to MySQL database successfully!");
});

module.exports = connection;