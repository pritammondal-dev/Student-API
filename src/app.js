const studentRoutes = require("./routes/student.routes");
const errorHandler = require("./middlewares/error.middleware");

const express = require("express");


const app = express();

//middleware to parse JSON data
app.use(express.json());

// create a route for student API 
app.use("/api/v1/students", studentRoutes);

// 404 handler
app.use ((req,res) =>{
    return res,status(404).json({
        success: false,
        message: "Rout not found"
    });
});

// Global error handler
app.use(errorHandler);

// test route
app.get("/", (req, res) => {
    res.status(200).json({
        sucess: true,
        massage: "Student API is running successfully"
    });
});

//  

module.exports = app;
