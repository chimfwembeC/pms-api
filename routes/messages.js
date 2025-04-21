const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const { authenticateToken } = require("../middleware/auth");


// Get all messages between the current user and another user
router.get('/:receiverId', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.id; // assuming user ID is available via token
    const receiverId = parseInt(req.params.receiverId);

    const messages = await Message.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Send a message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver and content required' });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
