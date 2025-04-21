// routes/auth.js

const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');
const Busboy = require('busboy');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const { authenticateToken, generateToken } = require('../middleware/auth');
require('dotenv').config();
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });


    const token = generateToken(newUser.id);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // console.log('email', email);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    res.json({ message: 'Login successful', token, 'user': user });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
router.put('/update-profile', authenticateToken, async (req, res) => {
  const bb = Busboy({ headers: req.headers });
  const formData = {};
  let filePath = '';

  bb.on('file', (fieldname, file, info) => {
    const { filename } = info;
    const saveTo = path.join(uploadsDir, `${Date.now()}-${filename}`);
    filePath = `/uploads/${path.basename(saveTo)}`;
    file.pipe(fs.createWriteStream(saveTo));
  });

  bb.on('field', (fieldname, val) => {
    formData[fieldname] = val;
  });

  bb.on('finish', async () => {
    try {
      const userId = formData.userId;
      if (!userId) return res.status(400).json({ message: 'Missing userId' });

      const user = await User.findByPk(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Hash password if being updated
      if (formData.password) {
        formData.password = await bcrypt.hash(formData.password, 10);
      }

      if (filePath) {
        formData.profile_path = filePath;
      }

      await user.update(formData);
      res.json(user);
    } catch (err) {
      console.error('Update error:', err);
      res.status(400).json({ message: err.message });
    }
  });

  req.pipe(bb);
});

module.exports = router;
