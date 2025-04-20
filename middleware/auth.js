// middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// get jwt token
const JWT_SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return err;
    req.userId = decoded.id;
    next();
  });
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "4h" })
}


module.exports = {
  authenticateToken,
  generateToken
};
