const express = require("express");
const router = express.Router();

const {
  signUpUser,
  sendEmailOTP,
  signInUser,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/userController");

router
  .post("/signup", signUpUser)
  .post("/signin", signInUser)
  .post("/otp", sendEmailOTP)
  .put("/user", updateUserProfile)
  .delete("/user/:userId", deleteUserProfile);

module.exports = router;
