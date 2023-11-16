const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken")

const {
  signUpUser,
  sendEmailOTP,
  signInUser,
  updateUserProfile,
  deleteUserProfile,
  currentUser,
  getSymptoms,
} = require("../controllers/userController");

router
  .post("/signup", signUpUser)
  .post("/signin", signInUser)
  .post("/otp", sendEmailOTP)
  .post("/symptoms", getSymptoms)
  .put("", validateToken,updateUserProfile)
  .get("", validateToken,currentUser)
  .delete("", validateToken, deleteUserProfile);

module.exports = router;
