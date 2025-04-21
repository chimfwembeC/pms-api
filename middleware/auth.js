// middleware/auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

// console.log("JWT_SECRET:", process.env.JWT_SECRET);

// get jwt token
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(403);

  // jwt.verify(token, JWT_SECRET, (err, decoded) => {
  //   if (err) return err;
  //   req.userId = decoded.id;
  //   next();
  // });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // <-- this is important!
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
