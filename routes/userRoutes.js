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
  processTextAndPredict,
} = require("../controllers/userController");

router
  .post("/signup", signUpUser)
  .post("/signin", signInUser)
  .post("/otp", sendEmailOTP)
  .post("/predict", processTextAndPredict)  
  .put("", validateToken,updateUserProfile)
  .get("", validateToken,currentUser)
  .delete("", validateToken, deleteUserProfile);

module.exports = router;
