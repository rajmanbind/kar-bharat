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
} = require('../controllers/user');
const { sendOTP, verifyUserOTP } = require('../controllers/otpController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');
const rateLimiter = require('../middleware/rateLimiter');
const cache = require('../middleware/cacheMiddleware');

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// OTP Routes
router.post(
  '/send-otp',

  sendOTP
);

router.post(
  '/verify-otp',
 
  verifyUserOTP
);

// Register user
router.post(
  '/',
  
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

// Get all workers (public) with caching
router.get('/workers/all', cache(60 * 15), getAllWorkers); // Cache for 15 minutes

// Get all brokers (public) with caching
router.get('/brokers', cache(60 * 15), getAllBrokers); // Cache for 15 minutes

// Search workers by skills
router.get('/search', cache(60 * 5), require('../controllers/searchController').searchWorkers);

module.exports = router;
