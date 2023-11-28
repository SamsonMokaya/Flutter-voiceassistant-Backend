const transporter = require("./emailTransporter")

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