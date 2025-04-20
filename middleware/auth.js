// middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = 'secret';

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
  return jwt.sign({id:userId}, JWT_SECRET, {expiresIn: "1h"})
}



module.exports = {
  authenticateToken,
 generateToken
};
