
const express = require('express');
const { check } = require('express-validator');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  getWorkersByBroker,
  getAllWorkers,
  getAllBrokers
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Register user
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('type', 'User type is required (customer, worker, or broker)').isIn(['customer', 'worker', 'broker']),
  ],
  registerUser
);

// Login user
router.post('/login', loginUser);

// User profile routes - protected
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('profileImage'), updateUserProfile);

// Get workers by broker
router.get('/workers', protect, admin, getWorkersByBroker);

// Get all workers (public)
router.get('/workers/all', getAllWorkers);

// Get all brokers (public)
router.get('/brokers', getAllBrokers);

module.exports = router;
