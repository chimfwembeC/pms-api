const { Message } = require('../models');

async function createMessage({ senderId, receiverId, content }) {
  return await Message.create({ senderId, receiverId, content });
}

module.exports = { createMessage };
