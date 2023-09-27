const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiry: {
        type: Date, // This field will store the expiry date
        required: true,
    }
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
