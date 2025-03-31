
const Order = require('../../models/orderModel');

/**
 * @desc    Get all orders for worker
 * @route   GET /api/orders/worker
 * @access  Private/Worker
 */
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

module.exports = {
  getWorkerOrders,
};
