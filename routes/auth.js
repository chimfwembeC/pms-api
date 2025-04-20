// routes/auth.js

const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const path = require('path');
// const multer = require('multer');
// const Busboy = require('busboy');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const {authenticateToken,generateToken }= require('../middleware/auth');
require('dotenv').config();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/users/profiles/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalName);
//   }
// });

// const upload = multer({storage});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;  

  try {
    const existingUser = await User.findOne({ where: { email } });
    // res.status(201).json({ message: req.body });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,      
    });

    // const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = generateToken(newUser.id);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Error during registration:', err.message);    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const token = generateToken(user.id);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// router.put('/update-profile',authenticateToken, upload.single('profile_path'),async (req, res) => {
router.put('/update-profile',authenticateToken,async (req, res) => {
  try {
    const busboy = new Busboy({headers: req.headers});
    let upload_path = '';

    

    const userId = req.userId;
    const {name, email, bio,profile_path} = req.body;
    // console.log(req);
    const user = await User.findByPk(userId);
    // const user = await User.findOne({where: {email: req.email}});


    if(!user){
      return res.status(404).json({message: "User Not Found"});      
    }

    // busboy.on('file', (fieldname, file, filename) => {
    //   upload_path = path.join(__dirname, 'uploads/profiles/', Date.now() + '-' + filename);
    //   const fstream = fs.createWriteStream(upload_path);
    //   file.pipe(fstream);
    // });

    // busboy.on('finish',() => {
    //   res.status(200).json({message: "profile picture updated", path: upload_path});
    // });

    // req.pipe(busboy);

    await user.update({name, email, bio, profile_path});
    res.json({message: "profile updated", user:user});


  } catch (error) {
      console.error("profile fetching error", error);
      return res.status(500).json({message: "Internal server error:", error});          
  }
});

module.exports = router;
