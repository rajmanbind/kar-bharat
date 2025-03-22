
const User = require('../../models/userModel');

// @desc    Get all workers (for customers to browse)
// @route   GET /api/users/workers/all
// @access  Public
const getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ 
      type: 'worker'
    }).select('-password').limit(100); // Limit to 100 workers for performance

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllWorkers
};
