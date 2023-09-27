const UserModel = require("../models/userModel");
const OtpModel = require("../models/emailOtpModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");


const signUpUser = asyncHandler(async (req, res) => {

    try{

        const {firstName, lastName, email, password} = req.body;

        if(!firstName || !lastName || !email || !password ){
            return res.status(400).json({message: "Please fill in all the fields"})
        }

        const userExists = await UserModel.findOne({ email }) 


        if(userExists){
            return res.status(400).json({message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
        });
        

        const userData = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        return res.status(201).json(userData);

    }catch(error){
        return res.status(500).json({error: error.message});
    }
    
});


// Send OTP to user email
// @route POST /api/user/sendEmailOTP
// @access public
const sendEmailOTP = async (req, res, next) => {

        const { email } = req.body;

        if ( !email ) {
            return res.status(400).json({ error: 'All fields are mandatory' });
        }

        const userExists = await UserModel.findOne({ email }) 


        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Email not found' });
        }

        if (!user.rows[0].verified) {
            return res.status(400).json({ error: 'User is not yet verified' });
        }



        let digits = "0123456789";

        const OTP = Array.from({ length: 6 }, () => digits[Math.floor(Math.random() * 10)]).join('');

        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 30); 



    try{

        const success = await sendEmail({
            subject: "One time OTP - Ki-journey",
            html: `
                <h3>Welcome back to Ki-journey!</h3>
                <p>Here is your one time otp: ${OTP}</p>
            `,
            to: email,
            from: process.env.GOOGLE_EMAIL
        });

        if(success){
            // Store OTP and expiry date in the database
            const otpResult = await OtpModel.create({
                email: email,
                otp: OTP,
                expiry: expiryDate,
            });
            if(otpResult){
                return res.status(200).json({ message: `OTP send to ${email} successfully` });
            }else{
                return res.status(200).json({ message: "There was an error saving the otp" });
            }
            
        }else{
            return res.status(500).json({ error: 'An error occured while sending the email' });
        }  
    }catch(error){
        return res.status(500).json({ message: error.message });
    }

}



const verifyEmailOTP = async (email, otp) => {
    if (!otp || !email) {
        return { status: 400, message: 'All fields are mandatory' };
    }

    try {
        const user = await pool.query('SELECT * FROM "USER" WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return { status: 404, message: 'Email not found' };
        }

    const otpResult = await pool.query('SELECT * FROM "OTP_EMAIL_CODES" WHERE user_id = $1 ORDER BY id DESC LIMIT 1', [user.rows[0].id]);

    if (otpResult.rows.length === 0 || otpResult.rows[0].otp_code !== otp) {
        return { status: 400, message: 'Invalid OTP' };
    }

    const expiryDate = new Date(otpResult.rows[0].expiry_date);
    const currentDate = new Date();

    if (currentDate > expiryDate) {
        return { status: 400, message: 'OTP has expired' };
    }

    return { status: 200, message: 'User OTP is correct' };

    } catch (error) {
        return { status: 500, message: error.message };
    }
};



// Log in to your account
// @route POST /api/user/login
// @access public
const signInUser = async (req, res, next) => {
    const { email, password, otp } = req.body;

    if (!password || !email || !otp) {
        return res.status(400).json({ error: 'All fields are mandatory' });
    }

    try {
        
        //check if user exists
        const user = await UserModel.findOne({ email });

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Email not found' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        try {
            // Call the verifyEmailOTP function with await
            const verificationResult = await verifyEmailOTP(email, otp);

            if (verificationResult.status === 200) {
                const accessToken = jwt.sign(
                    { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );
                return res.status(200).json({ accessToken });
            } else {
                return res.status(verificationResult.status).json({ error: verificationResult.message });
            }
        } catch (error) {
            return res.status(verificationResult.status).json({ error: error.message });
        }
      
    } catch (error) {
        return res.status(500).json({error: error.message}) // Pass the error to the error handling middleware
    }
};


module.exports = {signUpUser, signInUser, }