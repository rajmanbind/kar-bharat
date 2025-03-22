
const crypto = require('crypto');
const redisClient = require('../config/redis');

// OTP expiration time in seconds
const OTP_EXPIRY = 300; // 5 minutes

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
const generateOTP = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in Redis with expiry
 * @param {string} email - User email
 * @param {string} otp - Generated OTP
 */
const storeOTP = async (email, otp) => {
  const key = `otp:${email}`;
  await redisClient.set(key, otp, {
    EX: OTP_EXPIRY,
  });
};

/**
 * Verify OTP for a given email
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {Promise<boolean>} - Whether OTP is valid
 */
const verifyOTP = async (email, otp) => {
  const key = `otp:${email}`;
  const storedOTP = await redisClient.get(key);
  
  if (storedOTP && storedOTP === otp) {
    // Delete the OTP after successful verification
    await redisClient.del(key);
    return true;
  }
  
  return false;
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP,
};
