const express = require("express");
const router = express.Router();

const { signUpUser, sendEmailOTP, signInUser } = require("../controllers/userController");

router.post("/signup", signUpUser).post("/signin", signInUser).post("/otp", sendEmailOTP)


module.exports = router;