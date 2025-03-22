
const { validationResult } = require('express-validator');
const { generateOTP, storeOTP, verifyOTP } = require('../utils/otpUtils');

/**
 * @desc    Send OTP for user registration
 * @route   POST /api/users/send-otp
 * @access  Public
 */
const sendOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in Redis
    await storeOTP(email, otp);
    
    // In a real-world scenario, send the OTP via email/SMS
    // For development, we'll just return it in the response
    // In production, don't return the OTP in the response
    
    if (process.env.NODE_ENV === 'production') {
      // Send OTP via email/SMS service here
      res.status(200).json({ 
        message: 'OTP sent successfully',
        // Don't include the actual OTP in production
      });
    } else {
      // For development only
      res.status(200).json({ 
        message: 'OTP sent successfully',
        otp, // Remove this in production
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Verify OTP for registration
 * @route   POST /api/users/verify-otp
 * @access  Public
 */
const verifyUserOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;

  try {
    const isValid = await verifyOTP(email, otp);
    
    if (isValid) {
      res.status(200).json({ 
        verified: true,
        message: 'OTP verification successful'
      });
    } else {
      res.status(400).json({ 
        verified: false,
        message: 'Invalid OTP or OTP expired'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyUserOTP,
};
