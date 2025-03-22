
const redisClient = require('../config/redis');
const Notification = require('../models/notificationModel');

/**
 * Send a notification to a user
 * @param {string} userId - The recipient user ID
 * @param {string} type - Notification type (e.g., 'order', 'message')
 * @param {object} data - Notification data
 */
const sendNotification = async (userId, type, data) => {
  try {
    const notification = {
      id: data.id || Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Store notification in Redis for real-time access
    const key = `notifications:${userId}`;
    
    // Get existing notifications array or create empty array
    const existingNotifications = await redisClient.get(key);
    const notifications = existingNotifications 
      ? JSON.parse(existingNotifications) 
      : [];
    
    // Add new notification to array (limit to 50 most recent)
    notifications.unshift(notification);
    if (notifications.length > 50) {
      notifications.pop();
    }
    
    // Save notifications back to Redis
    await redisClient.set(key, JSON.stringify(notifications), {
      EX: 60 * 60 * 24 * 30, // 30 days expiry
    });
    
    // Publish notification for real-time updates
    await redisClient.publish('notifications', JSON.stringify({
      userId,
      notification,
    }));
    
    // Also persist to MongoDB for long-term storage if we have an ID
    if (data.id && data.id.match(/^[0-9a-fA-F]{24}$/)) {
      // Notification is already stored in MongoDB
      return notification;
    }
    
    // Create new notification in MongoDB
    await Notification.create({
      recipient: userId,
      sender: data.sender || null,
      type,
      title: data.title || 'New Notification',
      message: data.message || JSON.stringify(data),
      relatedOrder: data.orderId || null,
      isRead: false
    });
    
    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Get notifications for a user
 * @param {string} userId - The user ID
 * @param {number} limit - Maximum number of notifications to return
 * @returns {Promise<Array>} - Array of notifications
 */
const getNotifications = async (userId, limit = 20) => {
  try {
    const key = `notifications:${userId}`;
    const notifications = await redisClient.get(key);
    
    if (!notifications) {
      return [];
    }
    
    return JSON.parse(notifications).slice(0, limit);
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {string} userId - The user ID
 * @param {string} notificationId - The notification ID
 */
const markNotificationRead = async (userId, notificationId) => {
  try {
    const key = `notifications:${userId}`;
    const notificationsStr = await redisClient.get(key);
    
    if (!notificationsStr) {
      return false;
    }
    
    const notifications = JSON.parse(notificationsStr);
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex === -1) {
      return false;
    }
    
    notifications[notificationIndex].read = true;
    await redisClient.set(key, JSON.stringify(notifications), {
      KEEPTTL: true, // Keep the existing TTL
    });
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

module.exports = {
  sendNotification,
  getNotifications,
  markNotificationRead,
};
