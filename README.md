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
- `POST /api/user/extract`: Extract symptoms to be passed to the model.
- `PUT /api/user/update/:id` Update  user profile,
- `DELETE /api/user/delete/:id` Delete user account.

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
