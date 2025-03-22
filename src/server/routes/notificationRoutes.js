
const express = require('express');
const { 
  getUserNotifications,
  markAsRead,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const cache = require('../middleware/cacheMiddleware');

const router = express.Router();

// Get user notifications
router.get('/', protect, getUserNotifications);

// Mark notification as read
router.put('/:id/read', protect, markAsRead);

module.exports = router;
