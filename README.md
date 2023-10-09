# voiceassistantBackend


## Description

This project provides user authentication and OTP functionality using Node.js, Express, MongoDB, and other technologies.

## Getting Started

### Installation

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up your environment variables in a `.env` file.

### Usage

To run the server, use the command: `npm start`

## File Structure

- `server.js`: Main entry point of the application, where the server is initialized.
- `routes/userRoutes.js`: Handles user-related routes (signup, signin, OTP).
- `controllers/userController.js`: Contains the logic for user authentication and OTP functionality.
- `models/userModel.js`: Defines the user schema and model.
- `models/emailOtpModel.js`: Defines the OTP schema and model.
- `configs/sendEmail.js`: Configuration for sending emails.
- `configs/emailTransporter.js`: Configuration for creating a transporter to send emails.
- `middlewares/erroHandler.js`: Handles errors.
- `middlewares/validateToken.js`: validates user token to protect routes  needing authentication.

## Routes

- `POST /api/user/signup`: Register a new user.
- `POST /api/user/signin`: Authenticate user with email, password, and OTP.
- `POST /api/user/otp`: Send OTP to user's email.

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation.
- `STRING`: MongoDB connection string.
- `PORT`: Port on which the server runs.
- `ACCESS_TOKEN`, `REFRESH_TOKEN`: Tokens for authentication.
- `GOOGLE_EMAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Configuration for sending emails through Gmail.

## Dependencies

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `bcrypt`: Password hashing library.
- `jsonwebtoken`: Token-based authentication library.




PORT = 5000
DBPASSWORD = Fresh@123
ACCESS_TOKEN_SECRET = LETTHECHILDRENMOVE
TWILIOID = ACc3e6e2e279d99ec66deaee86d56bdadf
TWILIOTOKEN = 2301b65f58439a83c091ae2fe445cb59
GOOGLE_CLIENT_SECRET = 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
GOOGLE_CLIENT_ID = 601316748573-162gqo5s1jetefma15mlbeob6k1jg0gp.apps.googleusercontent.com
GOOGLE_EMAIL = mokayasamson950@gmail.com
REFRESH_TOKEN = 1//04zU1uar4Pq6ECgYIARAAGAQSNwF-L9IrRq1ixCvXliBmKknd4tEOHKe9TJ4l4OnX1MP9Nm6nXpEanmIaGDxwfk_V0XDxFNTK5ak
ACCESS_TOKEN = ya29.a0AfB_byAXMQ3QEmmfZpao1XdTYPUI3WObJNL-Li-Vr--VeH14jyLSwMDDmurriI8g7co4wEMxzOmaVhSEydelNXHXieqfOYC40S7ReuW9NgtCA5Rwb6V2R8WzOmTCInoxLo6l0ZRrUraoeJIBZG-1qho5oHzz2LlBntUyaCgYKAQYSARASFQGOcNnCZutAD3hFqaYlTqAvzhUWeg0171
