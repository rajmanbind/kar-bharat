
const Order = require('../../models/orderModel');
const { validateStatusChange } = require('../../utils/orderStatusUtils');

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
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

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private
 */
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

module.exports = {
  getOrderById,
  updateOrderStatus,
};
