const UserModel = require("../models/userModel");
const OtpModel = require("../models/emailOtpModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const sendEmail = require("../configs/sendEmail");
const jwt = require("jsonwebtoken");
const stringSimilarity = require("string-similarity");
const natural = require("natural");


const symptoms = [
  "itching",
  "skin rash",
  "nodal skin eruptions",
  "continuous sneezing",
  "shivering",
  "chills",
  "joint pain",
  "stomach pain",
  "acidity",
  "ulcers on tongue",
  "muscle wasting",
  "vomiting",
  "burning micturition",
  "spotting  urination",
  "fatigue",
  "weight gain",
  "anxiety",
  "cold hands and feets",
  "mood swings",
  "weight loss",
  "restlessness",
  "lethargy",
  "patches in throat",
  "irregular sugar level",
  "cough",
  "high fever",
  "sunken eyes",
  "breathlessness",
  "sweating",
  "dehydration",
  "indigestion",
  "headache",
  "yellowish skin",
  "dark urine",
  "nausea",
  "loss of appetite",
  "pain behind the eyes",
  "back pain",
  "constipation",
  "abdominal pain",
  "diarrhoea",
  "mild fever",
  "yellow urine",
  "yellowing of eyes",
  "acute liver failure",
  "fluid overload",
  "swelling of stomach",
  "swelled lymph nodes",
  "malaise",
  "blurred and distorted vision",
  "phlegm",
  "throat irritation",
  "redness of eyes",
  "sinus pressure",
  "runny nose",
  "congestion",
  "chest pain",
  "weakness in limbs",
  "fast heart rate",
  "pain during bowel movements",
  "pain in anal region",
  "bloody stool",
  "irritation in anus",
  "neck pain",
  "dizziness",
  "cramps",
  "bruising",
  "obesity",
  "swollen legs",
  "swollen blood vessels",
  "puffy face and eyes",
  "enlarged thyroid",
  "brittle nails",
  "swollen extremeties",
  "excessive hunger",
  "extra marital contacts",
  "drying and tingling lips",
  "slurred speech",
  "knee pain",
  "hip joint pain",
  "muscle weakness",
  "stiff neck",
  "swelling joints",
  "movement stiffness",
  "spinning movements",
  "loss of balance",
  "unsteadiness",
  "weakness of one body side",
  "loss of smell",
  "bladder discomfort",
  "foul smell of urine",
  "continuous feel of urine",
  "passage of gases",
  "internal itching",
  "toxic look (typhos)",
  "depression",
  "irritability",
  "muscle pain",
  "altered sensorium",
  "red spots over body",
  "belly pain",
  "abnormal menstruation",
  "dischromic  patches",
  "watering from eyes",
  "increased appetite",
  "polyuria",
  "family history",
  "mucoid sputum",
  "rusty sputum",
  "lack of concentration",
  "visual disturbances",
  "receiving blood transfusion",
  "receiving unsterile injections",
  "coma",
  "stomach bleeding",
  "distention of abdomen",
  "history of alcohol consumption",
  "fluid overload.1",
  "blood in sputum",
  "prominent veins on calf",
  "palpitations",
  "painful walking",
  "pus filled pimples",
  "blackheads",
  "scurring",
  "skin peeling",
  "silver like dusting",
  "small dents in nails",
  "inflammatory nails",
  "blister",
  "red sore around nose",
  "yellow crust ooze",
];

const tokenizer = new natural.WordTokenizer();
const porterStemmer = natural.PorterStemmer;



const extractSymptoms = async (req, res) => {
  var {text} = req.body;
  text = text.toLowerCase();
  const words = tokenizer.tokenize(text);
  const extractedSymptoms = {};
  const symptomArray = Array(symptoms.length).fill(0);

  for (let symptom of symptoms) {
    symptom = symptom.toLowerCase();
    const symptomWords = tokenizer.tokenize(symptom);

    for (let i = 0; i < words.length - symptomWords.length + 1; i++) {
      const wordSubset = words.slice(i, i + symptomWords.length);
      const wordSubsetStems = wordSubset.map((word) =>
        porterStemmer.stem(word)
      );

      const match = stringSimilarity.findBestMatch(
        symptomWords.join(" "),
        wordSubsetStems
      );

      if (match.bestMatch.rating >= 0.65) {
        // Consider the context of the words in the sentence
        const rating = Math.min(match.bestMatch.rating, 1);
        if (!extractedSymptoms[symptom]) {
          extractedSymptoms[symptom] = rating;
        } else {
          extractedSymptoms[symptom] = Math.max(
            extractedSymptoms[symptom],
            rating
          );
        }
        // Set the corresponding element to 1 in the array
        symptomArray[symptoms.indexOf(symptom)] = 1;
      }
    }
  }


  return res
    .status(200)
    .json({ extractedSymptoms: extractedSymptoms, symptomArray: symptomArray });
};

// Sign up user
// @route POST /api/user/signup
// @access public
const signUpUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all the fields" });
    }

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Send OTP to user email
// @route POST /api/user/sendEmailOTP
// @access public
const sendEmailOTP = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is mandatory" });
  }

  try {
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ error: "Email not found" });
    }

    let digits = "0123456789";
    const OTP = Array.from(
      { length: 6 },
      () => digits[Math.floor(Math.random() * 10)]
    ).join("");
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const success = await sendEmail({
      subject: "One time OTP - Health AI assistant",
      html: `
                <h3>Welcome back to Health AI assistant!</h3>
                <p>Here is your one time otp: ${OTP}</p>
            `,
      to: email,
      from: process.env.GOOGLE_EMAIL,
    });

    if (success) {
      // Store OTP and expiry date in the database
      const otpResult = await OtpModel.create({
        email: email,
        otp: OTP,
        expiry: expiryDate,
      });

      if (otpResult) {
        return res
          .status(200)
          .json({ message: `OTP sent to ${email} successfully` });
      } else {
        return res
          .status(500)
          .json({ error: "There was an error saving the OTP" });
      }
    } else {
      return res
        .status(500)
        .json({ error: "An error occurred while sending the email" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//verifies the otp sent
const verifyEmailOTP = async (email, otp) => {
  if (!otp || !email) {
    return { status: 400, message: "All fields are mandatory" };
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return { status: 404, message: "Email not found" };
    }

    const otpResult = await OtpModel.findOne(
      { email: user.email },
      {},
      { sort: { expiry: -1 } }
    );

    if (!otpResult || otpResult.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }

    const currentDate = new Date();

    if (currentDate > otpResult.expiry) {
      return { status: 400, message: "OTP has expired" };
    }

    return { status: 200, message: "User OTP is correct" };
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
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    try {
      // Call the verifyEmailOTP function with await
      const verificationResult = await verifyEmailOTP(email, otp);

      if (verificationResult.status === 200) {
        const accessToken = jwt.sign(
          { id: user._id, name: user.name, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "30m" }
        );

        const userData = {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };

        return res.status(200).json({ data: userData, token: accessToken });
      } else {
        return res
          .status(verificationResult.status)
          .json({ error: verificationResult.message });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update user profile
// @route PUT /api/user/
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, userId } = req.body;

  if (!firstName || !lastName || !email || userId) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  try {
    // Check if user exists
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if(password){
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update user data
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = hashedPassword;

      // Save the updated user
      await user.save();

      return res
        .status(200)
        .json({ message: "User profile updated successfully", data: user });

    }else{

      // Update user data
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;

      // Save the updated user
      await user.save();

      return res
        .status(200)
        .json({ message: "User profile updated successfully", data: user });

    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete user profile
// @route DELETE /api/user/:userId
// @access private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Check if user exists
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    await UserModel.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "User profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Show current user
// @route GET /api/user/
// @access private
const currentUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user data from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data as response
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = {
  signUpUser,
  sendEmailOTP,
  signInUser,
  updateUserProfile,
  deleteUserProfile,
  extractSymptoms,
  currentUser,
};
