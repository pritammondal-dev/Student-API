const studentRoutes = require("./routes/student.routes");

const express = require("express");


const app = express();

//middleware to parse JSON data
app.use(express.json());

// create a route for student API 
app.use("/api/v1/students", studentRoutes);

// test route
app.get("/", (req, res) => {
    res.status(200).json({
        sucess: true,
        massage: "Student API is running successfully"
    });
});

//  

module.exports = app;
