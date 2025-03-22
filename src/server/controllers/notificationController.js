
const { 
  getNotifications, 
  markNotificationRead 
} = require('../utils/notificationUtils');
const { z } = require('zod');

// Validation schema for marking a notification as read
const markReadSchema = z.object({
  notificationId: z.string().min(1, "Notification ID is required"),
});

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getUserNotifications = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const notifications = await getNotifications(req.user._id, parseInt(limit));
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
  try {
    // Validate input
    const validation = markReadSchema.safeParse({ 
      notificationId: req.params.id 
    });
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Invalid notification ID',
        errors: validation.error.errors
      });
    }
    
    const success = await markNotificationRead(
      req.user._id,
      req.params.id
    );
    
    if (success) {
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
};
