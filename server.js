const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT;

app.use(express.json());

//user route
app.use("/api/user", require("./routes/userRoutes"));

mongoose
  .connect(process.env.STRING)
  .then((result) => {
    console.log("DB COnnected!");
    app.listen(process.env.PORT);
    console.log("Server running on port " + process.env.PORT);
  })
  .catch((err) => {
    console.log(err.message);
  });
