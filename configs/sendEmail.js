const transporter = require("./emailTransporter")
const client = require('twilio')( process.env.TWILIOID,  process.env.TWILIOTOKEN);
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// emailOptions - who sends what to whom
const sendEmail = async (emailOptions) => {
    try {
        let emailTransporter = await transporter();
        await emailTransporter.sendMail(emailOptions);
        return true; // Success
    } catch (error) {
        console.error(error);
        return false; // Error
    }
};


    module.exports = sendEmail;