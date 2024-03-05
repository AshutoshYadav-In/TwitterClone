const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const Authroute = require('./Routes/Authroute');
const X = require('./Routes/X');
dotenv.config();
// Middleware setup
app.use(cors());
app.use(express.json());

//routes middleware
app.use('/api/auth', Authroute);
app.use('/api/user', X);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

//Server start
  app.listen(process.env.PORT,() => {
    console.log(`Server started on PORT ${process.env.PORT}`);
  });