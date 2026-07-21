const express = require("express");


const app = express();

//middleware to parse JSON data
app.use(express.json());

// test route
app.get("/", (req, res) => {
    res.status(200).json({
        sucess: true,
        massage: "Student API is running successfully"
    });
});

module.exports = app;
    