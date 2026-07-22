const mysql =require("mysql2/promise");

// Create a connection to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        // Test the database connection
        const connection = await pool.getConnection();
        console.log("Connected to MySQL database successfully!");
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error("Error connecting to MySQL database:", error);
        process.exit(1);
    }
})();

module.exports = pool;