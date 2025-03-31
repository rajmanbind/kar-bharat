// const crypto = require('crypto');
// const redisClient = require('../config/redis');

import { OTP_EXPIRY } from "../config/env.js";
import redisClient from "../config/redis.js";
import crypto from "crypto";

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
export const generateOTP = () => {
  // Generate a random 6-digit number
  // return Math.floor(100000 + Math.random() * 900000).toString();
    // Generate a random 4-digit number (1000-9999)
    return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Store OTP in Redis with expiry
 * @param {string} email - User email
 * @param {string} otp - Generated OTP
 */
export const storeOTP = async (email, otp) => {
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
export const verifyOtp = async (email, otp) => {
  const otpKey = `otp:${email}`;
  const verifiedKey = `otp:verified:${email}`;

  // Check if the OTP is already verified
  // const alreadyVerified = await redisClient.get(verifiedKey);
  // if (alreadyVerified) {
  //   return { success: true, message: "OTP already verified" };
  // }
  const storedOTP = await redisClient.get(otpKey);

  if (storedOTP && storedOTP === otp) {
    // Mark the OTP as verified
    await redisClient.set(verifiedKey, "true");
    // Delete the OTP after successful verification
    await redisClient.del(otpKey);

    return true;
  }

  return false;
};
