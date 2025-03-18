
const Order = require('../../models/orderModel');
const User = require('../../models/userModel');

/**
 * @desc    Get all orders for broker
 * @route   GET /api/orders/broker
 * @access  Private/Broker
 */
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

/**
 * @desc    Assign worker to an order (for broker)
 * @route   PUT /api/orders/:id/assign
 * @access  Private/Broker
 */
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

module.exports = {
  getBrokerOrders,
  assignWorkerToOrder,
};
