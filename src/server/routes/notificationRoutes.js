
const express = require('express');
const { 
  getUserNotifications,
  markAsRead,
  createNotification
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/auth');
const cache = require('../middleware/cacheMiddleware');

const router = express.Router();

// Get user notifications
router.get('/', protect, cache(60 * 5), getUserNotifications);

// Mark notification as read
router.put('/:id/read', protect, markAsRead);

// Create and send a notification (admin only)
router.post('/', protect, admin, createNotification);

module.exports = router;
