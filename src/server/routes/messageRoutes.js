
const express = require('express');
const { 
  sendMessage,
  getConversation,
  getConversations,
  getUnreadMessageCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Send a new message
router.post('/', protect, upload.array('attachments', 3), sendMessage);

// Get all conversations
router.get('/', protect, getConversations);

// Get unread message count
router.get('/unread', protect, getUnreadMessageCount);

// Get conversation with specific user
router.get('/:userId', protect, getConversation);

module.exports = router;
