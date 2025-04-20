const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Busboy = require('busboy');
const bcrypt = require('bcrypt');

const db = require('../models');
const User = db.User;
const Project = db.Project;
const Task = db.Task;
const { authenticateToken } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ========== [READ] GET all users ==========
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Project, as: 'projects', attributes: ['id', 'title', 'description', 'completed'] },
        { model: Task, as: 'tasks', attributes: ['id', 'title', 'description', 'completed'] }
      ]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== [READ] GET user by ID ==========
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: [
        { model: Project, as: 'projects', attributes: ['id', 'title', 'description', 'completed'] },
        { model: Task, as: 'tasks', attributes: ['id', 'title', 'description', 'completed'] }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ========== [CREATE] POST new user with file upload ==========
router.post('/', authenticateToken, (req, res) => {
  const bb = Busboy({ headers: req.headers });
  const formData = {};
  let uploadPath = '';

  bb.on('file', (fieldname, file, info) => {
    const { filename } = info;
    const saveTo = path.join(uploadsDir, filename);
    uploadPath = `/uploads/${filename}`;
    const stream = fs.createWriteStream(saveTo);
    file.pipe(stream);
  });

  bb.on('field', (name, val) => {
    formData[name] = val;
  });

  bb.on('finish', async () => {
    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const newUser = await User.create({
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        password: hashedPassword,
        profile_path: uploadPath || null,
      });

      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  req.pipe(bb);
});

// ========== [UPDATE] PUT update user ==========
router.put('/:id', authenticateToken, (req, res) => {
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
      const user = await User.findByPk(req.params.id);
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
      res.status(400).json({ message: err.message });
    }
  });

  req.pipe(bb);
});

// ========== [DELETE] DELETE user ==========
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
