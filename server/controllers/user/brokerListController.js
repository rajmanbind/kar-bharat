
const User = require('../../models/userModel');

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
  getAllBrokers
};
