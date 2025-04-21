// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');

// services
const { createMessage } = require('./utils/messageService');
// Route files
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');


const { authenticateToken } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
// Socket.IO Logic with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow front-end on localhost:3000
    methods: ['GET', 'POST'], // Allow GET and POST methods
    allowedHeaders: ['Content-Type'], // Allow specific headers if needed
    credentials: true // If you are using credentials (cookies)
  }
});

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
app.use('/api/messages', messageRoutes);

const db = require('./models');
const User = db.User;
const Message = db.Message;


// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Join the socket room for the user (based on their userId or username)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined the room`);
  });

  // Listen for incoming messages
  socket.on('sendMessage', async (data) => {
    try {
      const message = await createMessage(data);
      io.to(data.senderId).emit('receiveMessage', message);
      io.to(data.receiverId).emit('receiveMessage', message);
    } catch (error) {
      console.error('Error sending message via socket:', error);
    }
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
// --------------------
// Sequelize Models Init
// --------------------

db.sequelize.sync().then(() => {
  console.log('✅ Database synced');
});

// --------------------
// Authenticated user profile route
// --------------------
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
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
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
