
const { 
  getNotifications, 
  markNotificationRead,
  sendNotification 
} = require('../utils/notificationUtils');
const Notification = require('../models/notificationModel');
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
    
    // First try to get notifications from Redis (faster)
    let notifications = await getNotifications(req.user._id, parseInt(limit));
    
    // If Redis fails or has no data, fall back to MongoDB
    if (notifications.length === 0) {
      const dbNotifications = await Notification.find({ 
        recipient: req.user._id 
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('sender', 'name email')
      .populate('relatedOrder', 'title location');
      
      notifications = dbNotifications.map(notification => ({
        id: notification._id.toString(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: notification.createdAt.toISOString(),
        read: notification.isRead,
        data: {
          sender: notification.sender,
          orderId: notification.relatedOrder?._id,
          orderTitle: notification.relatedOrder?.title
        }
      }));
    }
    
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
    
    // Mark notification as read in Redis
    const success = await markNotificationRead(
      req.user._id,
      req.params.id
    );
    
    // Also update in MongoDB if the ID is a valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      await Notification.findByIdAndUpdate(
        req.params.id,
        { isRead: true }
      );
    }
    
    if (success) {
      res.json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create and send a notification to a user
 * @route   POST /api/notifications
 * @access  Private/Admin
 */
const createNotification = async (req, res) => {
  try {
    const { recipientId, type, title, message, relatedOrderId } = req.body;
    
    // Create notification in MongoDB
    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type,
      title,
      message,
      relatedOrder: relatedOrderId || null,
      isRead: false
    });
    
    // Also send via Redis for real-time delivery
    await sendNotification(recipientId, type, {
      id: notification._id.toString(),
      title,
      message,
      sender: req.user._id,
      orderId: relatedOrderId
    });
    
    res.status(201).json({ 
      message: 'Notification sent',
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  createNotification
};
