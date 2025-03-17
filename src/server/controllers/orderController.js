
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('worker', 'name email phone rating skills')
      .populate('broker', 'name email phone rating');

    if (order) {
      // Check if user is authorized to view this order
      if (
        order.customer._id.toString() === req.user._id.toString() ||
        (order.worker && order.worker._id.toString() === req.user._id.toString()) ||
        (order.broker && order.broker._id.toString() === req.user._id.toString())
      ) {
        res.json(order);
      } else {
        res.status(403);
        throw new Error('Not authorized to access this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for customer
// @route   GET /api/orders/customer
// @access  Private/Customer
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

// @desc    Get all orders for worker
// @route   GET /api/orders/worker
// @access  Private/Worker
const getWorkerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ worker: req.user._id })
      .populate('customer', 'name address')
      .populate('broker', 'name')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for broker
// @route   GET /api/orders/broker
// @access  Private/Broker
const getBrokerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ broker: req.user._id })
      .populate('customer', 'name address')
      .populate('worker', 'name skills rating')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check permissions based on status and user type
      const userType = req.user.type;
      const isAuthorized = (
        (userType === 'broker' && order.broker && order.broker.toString() === req.user._id.toString()) ||
        (userType === 'worker' && order.worker && order.worker.toString() === req.user._id.toString()) ||
        (userType === 'customer' && order.customer.toString() === req.user._id.toString())
      );

      if (!isAuthorized) {
        res.status(403);
        throw new Error('Not authorized to update this order');
      }

      // Add validation for status transitions
      const validStatusChange = validateStatusChange(order.status, status, userType);
      
      if (!validStatusChange) {
        res.status(400);
        throw new Error(`Cannot change status from ${order.status} to ${status} as ${userType}`);
      }

      order.status = status;
      
      if (status === 'in_progress') {
        order.startDate = Date.now();
      } else if (status === 'completed') {
        order.endDate = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to validate status transitions
const validateStatusChange = (currentStatus, newStatus, userType) => {
  // Define valid transitions for each user type
  const validTransitions = {
    broker: {
      pending: ['assigned', 'cancelled'],
      assigned: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
    },
    worker: {
      assigned: ['in_progress'],
      in_progress: ['completed'],
    },
    customer: {
      pending: ['cancelled'],
      assigned: ['cancelled'],
      in_progress: ['cancelled'],
      completed: ['completed'], // Can leave review on completed order
    },
  };

  // Check if the transition is valid
  if (validTransitions[userType] && validTransitions[userType][currentStatus]) {
    return validTransitions[userType][currentStatus].includes(newStatus);
  }

  return false;
};

// @desc    Assign worker to an order (for broker)
// @route   PUT /api/orders/:id/assign
// @access  Private/Broker
const assignWorkerToOrder = async (req, res) => {
  try {
    const { workerId } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if user is the broker for this order
    if (!order.broker || order.broker.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to assign workers to this order');
    }

    // Check if worker exists and belongs to this broker
    const worker = await User.findOne({ 
      _id: workerId, 
      type: 'worker',
      brokerId: req.user._id
    });

    if (!worker) {
      res.status(400);
      throw new Error('Worker not found or not assigned to you');
    }

    // Assign worker and update status
    order.worker = workerId;
    if (order.status === 'pending') {
      order.status = 'assigned';
    }

    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review to an order
// @route   POST /api/orders/:id/review
// @access  Private/Customer
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
  getOrderById,
  getCustomerOrders,
  getWorkerOrders,
  getBrokerOrders,
  updateOrderStatus,
  assignWorkerToOrder,
  addOrderReview,
};
