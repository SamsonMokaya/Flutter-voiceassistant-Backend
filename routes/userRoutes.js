const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken")

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
  .put("", validateToken,updateUserProfile)
  .get("", validateToken,currentUser)
  .delete("/user/:userId", validateToken, deleteUserProfile);

module.exports = router;
