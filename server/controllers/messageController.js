
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, orderId, content } = req.body;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // If orderId is provided, validate the order and check permissions
    if (orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user is part of this order
      const isParticipant = 
        order.customer.toString() === req.user._id.toString() ||
        (order.worker && order.worker.toString() === req.user._id.toString()) ||
        (order.broker && order.broker.toString() === req.user._id.toString());

      if (!isParticipant) {
        return res.status(403).json({ message: 'Not authorized to send messages for this order' });
      }

      // Check if receiver is part of this order
      const isReceiverParticipant = 
        order.customer.toString() === receiverId ||
        (order.worker && order.worker.toString() === receiverId) ||
        (order.broker && order.broker.toString() === receiverId);

      if (!isReceiverParticipant) {
        return res.status(400).json({ message: 'Receiver is not part of this order' });
      }
    }

    // Create the message
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      order: orderId || null,
      content,
    });

    // Save attachments if uploaded
    if (req.files && req.files.length > 0) {
      message.attachments = req.files.map(file => file.path);
    }

    const createdMessage = await message.save();

    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation with another user
// @route   GET /api/messages/:userId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    
    // Validate the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    }).sort('createdAt');

    // Mark messages as read if current user is the receiver
    const unreadMessages = messages.filter(
      msg => msg.receiver.toString() === req.user._id.toString() && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { 
          _id: { $in: unreadMessages.map(msg => msg._id) } 
        },
        { isRead: true }
      );
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages
// @access  Private
const getConversations = async (req, res) => {
  try {
    // Get all users the current user has exchanged messages with
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    }).sort('-createdAt');

    // Extract unique conversation partners
    const conversationPartners = new Map();

    messages.forEach(msg => {
      const partnerId = msg.sender.toString() === req.user._id.toString() 
        ? msg.receiver.toString() 
        : msg.sender.toString();
      
      if (!conversationPartners.has(partnerId)) {
        conversationPartners.set(partnerId, {
          userId: partnerId,
          lastMessage: {
            content: msg.content,
            timestamp: msg.createdAt,
            isRead: msg.isRead,
            sender: msg.sender.toString(),
          },
          unreadCount: (msg.receiver.toString() === req.user._id.toString() && !msg.isRead) ? 1 : 0
        });
      } else if (!msg.isRead && msg.receiver.toString() === req.user._id.toString()) {
        // Update unread count for existing conversation
        const conv = conversationPartners.get(partnerId);
        conv.unreadCount += 1;
        conversationPartners.set(partnerId, conv);
      }
    });

    // Get user details for each conversation partner
    const conversations = await Promise.all(
      Array.from(conversationPartners.values()).map(async (conv) => {
        const user = await User.findById(conv.userId).select('name profileImage type');
        return {
          ...conv,
          user: user || { name: 'Unknown User' }
        };
      })
    );

    // Sort by last message timestamp
    conversations.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread
// @access  Private
const getUnreadMessageCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadMessageCount,
};
