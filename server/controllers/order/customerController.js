
const Order = require('../../models/orderModel');
const User = require('../../models/userModel');
const { validationResult } = require('express-validator');
const { z } = require('zod');
const { sendNotification } = require('../../utils/notificationUtils');
const redisClient = require('../../config/redis');

// Order validation schema using Zod
const orderSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    'painting', 'carpentry', 'plumbing', 'electrical', 
    'cleaning', 'furniture', 'other'
  ]),
  location: z.object({
    address: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    }).optional(),
  }),
  price: z.number().optional(),
  workerId: z.string().optional(),
  brokerId: z.string().optional(),
});

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private/Customer
 */
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Validate order data with Zod
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Invalid order data',
        errors: validation.error.errors
      });
    }

    const { title, description, category, location, price, workerId, brokerId } = req.body;

    // Create a new order
    const order = new Order({
      customer: req.user._id,
      title,
      description,
      category,
      location,
      price: price || 0,
      worker: workerId || null,
      broker: brokerId || null,
      status: workerId ? 'assigned' : 'pending',
    });

    // Save images if uploaded
    if (req.files && req.files.length > 0) {
      order.images = req.files.map(file => file.path);
    }

    const createdOrder = await order.save();

    // Send notifications
    if (workerId) {
      const worker = await User.findById(workerId);
      
      // If worker is independent (no broker)
      if (!worker.brokerId) {
        // Send notification directly to worker
        await sendNotification(workerId, 'order_assigned', {
          orderId: createdOrder._id,
          title: createdOrder.title,
          customerName: req.user.name,
          customerPhone: req.user.phone,
          location: createdOrder.location,
        });
      } 
      // If worker is associated with a broker
      else if (worker.brokerId) {
        // Send notification to broker
        await sendNotification(worker.brokerId, 'worker_booked', {
          orderId: createdOrder._id,
          workerId: workerId,
          workerName: worker.name,
          title: createdOrder.title,
          customerName: req.user.name,
          location: createdOrder.location,
        });
      }
    }
    
    // Cache order details for faster access
    await redisClient.set(`order:${createdOrder._id}`, JSON.stringify({
      _id: createdOrder._id,
      title: createdOrder.title,
      status: createdOrder.status,
      customer: req.user._id,
    }), { EX: 3600 }); // 1 hour cache

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all orders for customer
 * @route   GET /api/orders/customer
 * @access  Private/Customer
 */
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('worker', 'name rating')
      .populate('broker', 'name rating')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Add review to an order
 * @route   POST /api/orders/:id/review
 * @access  Private/Customer
 */
const addOrderReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Only customer can leave a review
    if (order.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the customer can leave a review');
    }

    // Order must be completed
    if (order.status !== 'completed') {
      res.status(400);
      throw new Error('Can only review completed orders');
    }

    // Create review
    order.review = {
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    await order.save();

    // Update worker's rating
    if (order.worker) {
      const worker = await User.findById(order.worker);
      if (worker) {
        const totalRating = worker.rating * worker.ratingCount + Number(rating);
        worker.ratingCount += 1;
        worker.rating = totalRating / worker.ratingCount;
        await worker.save();
      }
    }

    // Also update broker's rating if applicable
    if (order.broker) {
      const broker = await User.findById(order.broker);
      if (broker) {
        const totalRating = broker.rating * broker.ratingCount + Number(rating);
        broker.ratingCount += 1;
        broker.rating = totalRating / broker.ratingCount;
        await broker.save();
      }
    }

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  addOrderReview,
};
