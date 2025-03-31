
const express = require('express');
const { check } = require('express-validator');
const { 
  createOrder,
  getOrderById,
  getCustomerOrders,
  getWorkerOrders,
  getBrokerOrders,
  updateOrderStatus,
  assignWorkerToOrder,
  addOrderReview
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Create new order
router.post(
  '/',
  protect,
  upload.array('images', 5),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('location', 'Location information is required').not().isEmpty(),
  ],
  createOrder
);

// Get order by ID
router.get('/:id', protect, getOrderById);

// Get orders by user type
router.get('/customer/orders', protect, getCustomerOrders);
router.get('/worker/orders', protect, getWorkerOrders);
router.get('/broker/orders', protect, getBrokerOrders);

// Update order status
router.put(
  '/:id/status',
  protect,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('status', 'Invalid status').isIn(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
  ],
  updateOrderStatus
);

// Assign worker to order (broker only)
router.put(
  '/:id/assign',
  protect,
  [
    check('workerId', 'Worker ID is required').not().isEmpty(),
  ],
  assignWorkerToOrder
);

// Add review to order
router.post(
  '/:id/review',
  protect,
  [
    check('rating', 'Rating is required and must be between 1-5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty(),
  ],
  addOrderReview
);

module.exports = router;
