const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;


const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    )

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    })

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            reject("Failed to create access token :(");
          }
          resolve(token);
        });
      });


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.GOOGLE_EMAIL,
            accessToken: process.env.GOOGLE_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN   
        }
    });

    return transporter;

    };


module.exports = createTransporter;