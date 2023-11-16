const fs = require('fs');
const csv = require('csv-parser');
const symptomData = [];

fs.createReadStream('testing.csv')
  .pipe(csv())
  .on('data', (row) => {
    symptomData.push(row);
  })
  .on('end', () => {
    console.log('Data loaded');
  });

// Rest of your server.js code below...

const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

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
