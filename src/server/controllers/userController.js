
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone, type, address } = req.body;

  try {
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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.type,
        address: user.address,
        profileImage: user.profileImage,
        skills: user.skills,
        rating: user.rating,
        ratingCount: user.ratingCount,
        brokerId: user.brokerId,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address,
        };
      }
      
      if (req.body.skills) {
        user.skills = req.body.skills;
      }
      
      if (req.file) {
        user.profileImage = req.file.path;
      }
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        type: updatedUser.type,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        skills: updatedUser.skills,
        rating: updatedUser.rating,
        ratingCount: updatedUser.ratingCount,
        brokerId: updatedUser.brokerId,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get workers by broker ID
// @route   GET /api/users/workers
// @access  Private/Broker
const getWorkersByBroker = async (req, res) => {
  try {
    const workers = await User.find({ 
      brokerId: req.user._id,
      type: 'worker'
    });

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all workers (for customers to browse)
// @route   GET /api/users/workers/all
// @access  Public
const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ 
      type: 'worker'
    }).select('-password');

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all brokers (for customers to browse)
// @route   GET /api/users/brokers
// @access  Public
const getAllBrokers = async (req, res) => {
  try {
    const brokers = await User.find({ 
      type: 'broker'
    }).select('-password');

    res.json(brokers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getWorkersByBroker,
  getAllWorkers,
  getAllBrokers,
};
