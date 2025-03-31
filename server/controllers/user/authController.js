
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { z } = require('zod');
const { verifyOTP } = require('../../utils/otpUtils');
const redisClient = require('../../config/redis');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// User validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please include a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  type: z.enum(["customer", "worker", "broker"], {
    required_error: "User type must be customer, worker, or broker"
  }),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  skills: z.array(z.string()).optional(),
  brokerId: z.string().optional(),
});

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Validate user data with Zod
    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: 'Invalid user data',
        errors: validation.error.errors
      });
    }

    const { name, email, password, phone, type, address, otpVerified } = req.body;

    // Check if user has verified their email with OTP
    if (otpVerified !== 'true') {
      return res.status(400).json({ message: 'Email verification required' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user based on type
    const user = await User.create({
      name,
      email,
      password,
      phone,
      type,
      address: address || {},
      skills: req.body.skills || [],
      brokerId: req.body.brokerId || null,
    });

    if (user) {
      // Cache user in Redis for faster authentication
      const userCache = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        type: user.type,
      };
      
      await redisClient.set(`user:${user._id}`, JSON.stringify(userCache), {
        EX: 86400, // 24 hours
      });
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        address: user.address,
        skills: user.skills,
        brokerId: user.brokerId,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        address: user.address,
        skills: user.skills,
        brokerId: user.brokerId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
  // userSchema,
};
