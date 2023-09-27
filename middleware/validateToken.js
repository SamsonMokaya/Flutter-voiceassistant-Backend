const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(err); // Pass the error to the error handling middleware
      } else {
        req.user = decoded;
        next(); // Call next to pass control to the next route handler
      }
    });
  } else {
    res.status(401).json({ error: 'User is not authorized' });
  }
});

module.exports = validateToken;