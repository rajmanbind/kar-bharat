// const express = require('express');
// const { check } = require('express-validator');
import { Router } from 'express';
import { registerUser ,loginUser, verifyOTP,sendOTP,registerUserTwo} from '../controllers/auth/auth.controller.js';
import {handleUploadErrors, uploadSingle}  from '../middleware/multer.middleware.js';
import authorize from '../middleware/auth.middleware.js';
// const { 
//   registerUser, 
//   loginUser, 
//   getUserProfile, 
//   updateUserProfile,
//   getWorkersByBroker,
//   getAllWorkers,
//   getAllBrokers
// } = require('../controllers/user');
// const { sendOTP, verifyUserOTP } = require('../controllers/otpController');
// const { protect, admin } = require('../middleware/auth');
// const upload = require('../middleware/uploadMiddleware');
// const rateLimiter = require('../middleware/rateLimiter');
// const cache = require('../middleware/cacheMiddleware');

const authRouter = Router();

// Apply rate limiting to all routes
// authRouter.use(rateLimiter);

// OTP Routes
// authRouter.post(
//   '/send-otp',
//   [
//     check('email', 'Please include a valid email').isEmail(),
//   ],
//   sendOTP
// );

// authRouter.post(
//   '/verify-otp',
//   [
//     check('email', 'Please include a valid email').isEmail(),
//     check('otp', 'OTP is required').isLength({ min: 6, max: 6 }),
//   ],
//   verifyUserOTP
// );

// Register user
// authRouter.post(
//   '/',
//   [
//     check('name', 'Name is required').not().isEmpty(),
//     check('email', 'Please include a valid email').isEmail(),
//     check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
//     check('phone', 'Phone number is required').not().isEmpty(),
//     check('type', 'User type is required (customer, worker, or broker)').isIn(['customer', 'worker', 'broker']),
//     check('otpVerified', 'OTP verification is required').equals('true'),
//   ],
//   registerUser
// );

//register user
import multer from 'multer';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
});

authRouter.put(
  "/register-two",
  authorize,
  (req, res, next) => uploadSingle(req, res, (err) => 
    err ? handleUploadErrors(err, req, res, next) : next()
  ),
  registerUserTwo
);
authRouter.post("/register",registerUser)
// authRouter.put("/register-two",authorize,  upload.fields([{ name: "profileImage", maxCount: 1 }]),registerUserTwo,handleUploadErrors)
// authRouter.put("/register-two",authorize,   upload.single("profileImage"), registerUserTwo,handleUploadErrors)
// authRouter.put("/register-two",authorize,  (req, res, next) => {
//     uploadSingle(req, res, (err) => {
//       if (err) return handleUploadErrors(err, req, res, next);
//       next();
//     });
//   }, registerUserTwo)
// authRouter.put(
//     "/register-two",
//     authorize,
//     upload.single("profileImage"),  // Only accepts single file with field name "profileImage"
//     registerUserTwo,
//     handleUploadErrors
//   );
// Login user
authRouter.post('/login', loginUser);
authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp', verifyOTP);

// // User profile routes - protected
// authRouter.route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, upload.single('profileImage'), updateUserProfile);

// // Get workers by broker
// authRouter.get('/workers', protect, admin, getWorkersByBroker);

// // Get all workers (public) with caching
// authRouter.get('/workers/all', cache(60 * 15), getAllWorkers); // Cache for 15 minutes

// // Get all brokers (public) with caching
// authRouter.get('/brokers', cache(60 * 15), getAllBrokers); // Cache for 15 minutes

// // Search workers by skills
// authRouter.get('/search', cache(60 * 5), require('../controllers/searchController').searchWorkers);

export default authRouter;
