// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

// Route files
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------
// JWT Secret Fallback
// --------------------
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
process.env.JWT_SECRET = JWT_SECRET; // make sure it's accessible across the app

// --------------------
// Middleware Setup
// --------------------
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// --------------------
// Sequelize Models Init
// --------------------
const db = require('./models');
const User = db.User;
const Project = db.Project;
const Task = db.Task;

db.sequelize.sync().then(() => {
  console.log('✅ Database synced');
});

// --------------------
// Authenticated user profile route
// --------------------
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.userId } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// --------------------
// Start Server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
